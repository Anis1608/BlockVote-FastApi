from fastapi import FastAPI, APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
import json, os, hmac, hashlib
from web3 import Web3
from cryptography.fernet import Fernet
from dotenv import load_dotenv

from sqlalchemy.orm import Session
from database.db import get_db, redis_client  # your existing DB + Redis setup
from middleware.security import access_check_for_admin  # admin auth


# ---------- ENV / WEB3 SETUP ----------
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

# ---------- ENCRYPTION ----------
FERNET_KEY = os.getenv("FERNET_KEY")
if not FERNET_KEY:
    raise RuntimeError("FERNET_KEY missing in env")
fernet = Fernet(FERNET_KEY.encode())


def decrypt_private_key(encrypted_pk: str) -> str:
    return fernet.decrypt(encrypted_pk.encode()).decode()


def encrypt_private_key(pk: str) -> str:
    return fernet.encrypt(pk.encode()).decode()


# ---------- MODELS ----------
class CastVoteRequest(BaseModel):
    voter_id: str
    candidate: str


# ---------- NONCE MANAGER ----------
def get_safe_nonce(admin_wallet: str) -> int:
    """
    Atomically get a unique nonce for an admin wallet using Redis counter.
    Keeps pending txs in sync across workers.
    """
    admin_wallet = w3.to_checksum_address(admin_wallet)
    nonce_key = f"nonce:{admin_wallet}"

    if not redis_client.exists(nonce_key):
        nonce_on_chain = w3.eth.get_transaction_count(admin_wallet, "pending")
        redis_client.set(nonce_key, nonce_on_chain)

    # incr returns new value; subtract 1 to use it as current nonce
    return redis_client.incr(nonce_key) - 1


# ---------- BACKGROUND TX WORKER ----------
def process_vote(
    admin_wallet: str,
    voter_id_hmac: str,
    candidate: str,
    encrypted_admin_key: str,
):
    admin_wallet = w3.to_checksum_address(admin_wallet)
    status_key = f"vote_status:{admin_wallet}:{voter_id_hmac}"

    try:
        private_key_admin = decrypt_private_key(encrypted_admin_key)
        account = w3.eth.account.from_key(private_key_admin)
        nonce = get_safe_nonce(admin_wallet)

        # Build tx: castVote(voterId, candidate) uses msg.sender = admin
        txn = contract.functions.castVote(voter_id_hmac, candidate).build_transaction({
            "chainId": chain_id,
            "from": account.address,
            "nonce": nonce,
            "gas": 300000,
            "gasPrice": w3.eth.gas_price,
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key_admin)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        redis_client.set(
            status_key,
            json.dumps({
                "status": "success",
                "tx_hash": tx_hash.hex(),
                "block_number": receipt.blockNumber
            }),
            ex=300
        )

        print(f"Vote cast successfully: {tx_hash.hex()}")

    except Exception as e:
        redis_client.set(
            status_key,
            json.dumps({"status": "failed", "reason": str(e)}),
            ex=300
        )
        print(f"Error casting vote: {e}")


# ---------- ROUTES ----------
@router.post("/cast-vote")
async def cast_vote(
    data: CastVoteRequest,
    background_tasks: BackgroundTasks,
    admin_data=Depends(access_check_for_admin),
    db: Session = Depends(get_db)
):
    try:
        # 1) Derive HMAC voter id scoped to the admin
        secret_key = os.getenv("SECRET_KEY")
        if not secret_key:
            raise HTTPException(status_code=500, detail="SECRET_KEY missing in env")

        admin_id = admin_data["admin_id"]
        admin_wallet = w3.to_checksum_address(admin_data["wallet_address"])

        # Scope voter hash to admin to avoid cross-admin collisions
        combined_key = f"{secret_key}{admin_id}"
        voter_id_hmac = hmac.new(
            combined_key.encode(),
            data.voter_id.encode(),
            hashlib.sha256
        ).hexdigest()

        # 2) Optional: ensure candidate is registered to avoid revert
        # try:
        #     is_registered = contract.functions.isCandidateRegistered(admin_wallet, data.candidate).call()
        # except Exception as e:
        #     raise HTTPException(status_code=400, detail=f"Contract call failed (isCandidateRegistered): {str(e)}")

        # if not is_registered:
        #     return {
        #         "status": "failed",
        #         "message": "Candidate not registered for this admin."
        #     }

        # 3) Check if voter already voted under this admin
        try:
            has_voted = contract.functions.hasVoted(admin_wallet, voter_id_hmac).call()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Contract call failed (hasVoted): {str(e)}")

        if has_voted:
            return {
                "status": "failed",
                "message": "Voter has already cast a vote for this admin."
            }

        # 4) Queue background task to submit the transaction
        background_tasks.add_task(
            process_vote,
            admin_wallet,
            voter_id_hmac,
            data.candidate,
            admin_data["wallet_secret"],
        )

        # 5) Mark queued in Redis (key includes admin scope)
        redis_client.set(
            f"vote_status:{admin_wallet}:{voter_id_hmac}",
            json.dumps({"status": "queued"}),
            ex=300
        )

        return {
            "status": "queued",
            "message": "Vote is being processed in the background."
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/vote-status/{voter_id}")
async def vote_status(voter_id: str, admin_data=Depends(access_check_for_admin)):
    """
    Client supplies the original voter_id; we derive the same HMAC and look up status.
    Status is scoped per admin.
    """
    secret_key = os.getenv("SECRET_KEY")
    if not secret_key:
        raise HTTPException(status_code=500, detail="SECRET_KEY missing in env")

    admin_id = admin_data["admin_id"]
    admin_wallet = w3.to_checksum_address(admin_data["wallet_address"])
    combined_key = f"{secret_key}{admin_id}"
    voter_id_hmac = hmac.new(
        combined_key.encode(),
        voter_id.encode(),
        hashlib.sha256
    ).hexdigest()

    status_key = f"vote_status:{admin_wallet}:{voter_id_hmac}"
    status = redis_client.get(status_key)

    if not status:
        return {"status": "not_found", "message": "No vote found for this voter."}

    return json.loads(status)
