from fastapi import FastAPI, APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
import json, os
from web3 import Web3
from cryptography.fernet import Fernet
from dotenv import load_dotenv

from sqlalchemy.orm import Session
from database.db import get_db, redis_client  # your existing DB + Redis setup
from middleware.security import access_check_for_admin  # admin auth

load_dotenv()
app = FastAPI()
router = APIRouter()

RPC_URL = os.getenv("AVAX_RPC")
w3 = Web3(Web3.HTTPProvider(RPC_URL))
chain_id = int(os.getenv("CHAIN_ID"))

with open("./deploy-contract/Voting_abi.json", "r") as f:
    abi = json.load(f)

contract_address = os.getenv("SMART_CONTRACT_ADDRESS")
contract = w3.eth.contract(address=contract_address, abi=abi)

# Encryption
FERNET_KEY = os.getenv("FERNET_KEY")
fernet = Fernet(FERNET_KEY.encode())
def decrypt_private_key(encrypted_pk: str) -> str:
    return fernet.decrypt(encrypted_pk.encode()).decode()

class CastVoteRequest(BaseModel):
    voter_id: str
    candidate: str

def get_safe_nonce(admin_wallet: str) -> int:
    """
    Atomically get a unique nonce for an admin wallet using Redis counter.
    """
    nonce_key = f"nonce:{admin_wallet}"

    if not redis_client.exists(nonce_key):
        nonce_on_chain = w3.eth.get_transaction_count(admin_wallet, "pending")
        redis_client.set(nonce_key, nonce_on_chain)

    return redis_client.incr(nonce_key) - 1

def process_vote(voter_id: str, candidate: str, encrypted_admin_key: str, admin_wallet: str):
    status_key = f"vote_status:{voter_id}"
    try:
        PRIVATE_KEY_ADMIN = decrypt_private_key(encrypted_admin_key)
        account = w3.eth.account.from_key(PRIVATE_KEY_ADMIN)
        nonce = get_safe_nonce(admin_wallet)

        txn = contract.functions.castVote(voter_id, candidate).build_transaction({
            "chainId": chain_id,
            "from": account.address,
            "nonce": nonce,
            "gas": 300000,
            "gasPrice": w3.eth.gas_price
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY_ADMIN)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        redis_client.set(status_key, json.dumps({
            "status": "success",
            "tx_hash": tx_hash.hex(),
            "block_number": receipt.blockNumber
        }), ex=300)

        print(f"Vote cast successfully: {tx_hash.hex()}")

    except Exception as e:
        redis_client.set(status_key, json.dumps({
            "status": "failed",
            "reason": str(e)
        }))
        print(f"Error casting vote: {e}")

@router.post("/cast-vote")
async def cast_vote(
    data: CastVoteRequest,
    background_tasks: BackgroundTasks,
    admin_data=Depends(access_check_for_admin),
    db: Session = Depends(get_db)
):
    try:
        if contract.functions.hasVoted(data.voter_id).call():
            return {
                "status": "failed",
                "message": "Voter has already casted a vote."
            }
        background_tasks.add_task(
            process_vote,
            data.voter_id,
            data.candidate,
            admin_data["wallet_secret"],
            admin_data["wallet_address"]
        )
        redis_client.set(f"vote_status:{data.voter_id}", json.dumps({"status": "queued"}))

        # Optional: log in DB
        # db.execute("INSERT INTO votes (voter_id, candidate, status) VALUES (:v, :c, :s)",
        #            {"v": data.voter_id, "c": data.candidate, "s": "queued"})
        # db.commit()

        return {
            "status": "queued",
            "message": "Vote is being processed in the background."
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/vote-status/{voter_id}")
async def vote_status(voter_id: str):
    status_key = f"vote_status:{voter_id}"
    status = redis_client.get(status_key)
    if not status:
        return {"status": "not_found", "message": "No vote found for this voter."}
    return json.loads(status)
