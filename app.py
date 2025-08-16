from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from web3 import Web3
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from pymongo import MongoClient
import os

# ------------------ Load ENV ------------------
load_dotenv()

RPC = os.getenv("AVAX_RPC")  # Fuji RPC
CHAIN_ID = int(os.getenv("CHAIN_ID", "43113"))  # Fuji chain ID
FUNDING_KEY = os.getenv("FUNDING_KEY")  # Private key of funding wallet
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# ------------------ Web3 Setup ------------------
w3 = Web3(Web3.HTTPProvider(RPC))
funding_account = w3.eth.account.from_key(FUNDING_KEY)

# ------------------ Encryption Key ------------------
FERNET_KEY = os.getenv("FERNET_KEY")
if not FERNET_KEY:
    FERNET_KEY = Fernet.generate_key().decode()
    print(f"[INFO] Generated new FERNET_KEY: {FERNET_KEY}")
fernet = Fernet(FERNET_KEY.encode())

# ------------------ MongoDB ------------------
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["VotingSystem"]
admin_collection = db["admins"]

# ------------------ FastAPI App ------------------
app = FastAPI(title="Avalanche Admin Wallet API")

# ------------------ Models ------------------
class AdminResponse(BaseModel):
    address: str
    encrypted_private_key: str
    funding_tx_hash: str

class AdminData(BaseModel):
    address: str
    encrypted_private_key: str
    funding_tx_hash: str

# ------------------ Utility ------------------
def encrypt_private_key(pk: str) -> str:
    return fernet.encrypt(pk.encode()).decode()

def send_avax(to_address: str, amount_in_avax: float) -> str:
    """Send AVAX from funding account"""
    try:
        tx = {
            "nonce": w3.eth.get_transaction_count(funding_account.address),
            "to": w3.to_checksum_address(to_address),
            "value": w3.to_wei(amount_in_avax, "ether"),
            "gas": 21000,
            "gasPrice": w3.eth.gas_price,
            "chainId": CHAIN_ID
        }
        signed_tx = w3.eth.account.sign_transaction(tx, FUNDING_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash.hex()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Funding transaction failed: {str(e)}")

# ------------------ Routes ------------------
@app.post("/register_admin", response_model=AdminResponse)
def register_admin():
    """Create new admin wallet, encrypt key, auto-fund with testnet AVAX"""
    # Generate wallet
    new_acct = w3.eth.account.create()

    # Encrypt PK
    encrypted_pk = encrypt_private_key(new_acct.key.hex())

    # Send AVAX
    tx_hash = send_avax(new_acct.address, 1)  # send 1 AVAX

    # Save to DB
    admin_collection.insert_one({
        "address": new_acct.address,
        "encrypted_private_key": encrypted_pk,
        "funding_tx_hash": tx_hash
    })

    return AdminResponse(
        address=new_acct.address,
        encrypted_private_key=encrypted_pk,
        funding_tx_hash=tx_hash
    )

@app.get("/super_admin_fetch")
def super_admin_fetch():
    """Fetch all admin wallets"""
    admins = list(admin_collection.find({}, {"_id": 0}))
    return {"count": len(admins), "admins": admins}
