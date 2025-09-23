import json
from fastapi import APIRouter, Depends, HTTPException , BackgroundTasks , Request , Body
from uuid import uuid4
import redis
from ua_parser import user_agent_parser
from sqlalchemy import text
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from utils.json_serializer import json_serializer_for_time
from database.db import get_db
from pydantic_models.Super_admin import SuperAdmin , SuperAdminLogin , SuperAdminCreatesAdmin
from utils.id_generator import generateIdForAdmin
from middleware.security import access_check
from fastapi.responses import JSONResponse
from database.db import get_redis
import jwt
import os
import time
from web3 import Web3
from cryptography.fernet import Fernet
from dotenv import load_dotenv
from database.db import redis_client , get_db 
from utils.otp_on_email import generate_otp , send_otp_email , verify_otp , store_otp_in_redis


load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
SESSTION_TTL = int(os.getenv("SESSION_TTL", 3600))  

RPC = os.getenv("AVAX_RPC") 
CHAIN_ID = int(os.getenv("CHAIN_ID", "43113")) 
FUNDING_KEY = os.getenv("FUNDING_KEY")  # Private key of funding wallet

w3 = Web3(Web3.HTTPProvider(RPC))
funding_account = w3.eth.account.from_key(FUNDING_KEY)


with open("./deploy-contract/Voting_abi.json", "r") as f:
    abi = json.load(f)

contract_address = os.getenv("SMART_CONTRACT_ADDRESS")
print(f"Smart Contract Address: {contract_address}")
contract = w3.eth.contract(address=contract_address, abi=abi)

FERNET_KEY = os.getenv("FERNET_KEY")
fernet = Fernet(FERNET_KEY.encode())

def encrypt_private_key(pk: str) -> str:
    return fernet.encrypt(pk.encode()).decode()
def send_avax(to_address: str, amount_in_avax: float) -> str:
    """Send AVAX from funding account and wait for confirmation"""
    try:
        to_address = w3.to_checksum_address(to_address)
        nonce = w3.eth.get_transaction_count(funding_account.address, 'pending')
        tx = {
            "nonce": nonce,
            "to": to_address,
            "value": w3.to_wei(amount_in_avax, "ether"),
            "gas": 21000,
            "gasPrice": w3.eth.gas_price,
            "chainId": CHAIN_ID
        }
        signed_tx = w3.eth.account.sign_transaction(tx, FUNDING_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        # Wait for transaction to be mined
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        # print(f"AVAX sent: {amount_in_avax} to {to_address}, tx hash: {tx_hash.hex()}")

        return tx_hash.hex()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Funding transaction failed: {str(e)}")



router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Custom function to handle datetime serialization


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

@router.post("/super_admin/register")
async def register_super_admin(super_admin: SuperAdmin, db: Session = Depends(get_db)):
    try:
        # Check if super admin already exists
        existing_admin = db.execute(
            text("SELECT COUNT(*) as Total_super_admin FROM super_admin")
        ).fetchone()

        if existing_admin[0] >= 1:
            raise HTTPException(
                status_code=400,
                detail="Super admin already exists. This system can only have one Super Admin"
            )

        # Hash the password before storing
        hashed_password = hash_password(super_admin.password)

        db.execute(
            text("""
                INSERT INTO super_admin ("super_admin_id", username, email, password)
                VALUES (:super_admin_id, :username, :email, :password)
            """),
            {
                "super_admin_id": super_admin.super_admin_id,
                "username": super_admin.username,
                "email": super_admin.email,
                "password": hashed_password
            }
        )
        db.commit()
        return {"message": "Super admin registered successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/super_admin/login-request")
async def login_super_admin(
    login_data: SuperAdminLogin,
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None
):
    try:
        # Fetch the super admin from the database
        result = db.execute(
    text('SELECT * FROM super_admin WHERE super_admin_id = :super_admin_id AND email = :email'),
    {"super_admin_id": login_data.super_admin_id, "email": login_data.email}
).mappings().fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Super admin not found")

        # Verify the password
        if not pwd_context.verify(login_data.password, result['password']):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        otp = generate_otp()
        # store_otp_in_redis(login_data.email, otp , "login")
        background_tasks.add_task(store_otp_in_redis, login_data.email, otp , "login" )
        background_tasks.add_task(send_otp_email, login_data.email, otp)
        try:
            result = redis_client.set(f"temp:login:{login_data.email}", login_data.super_admin_id, ex=300)
            print("Redis SET result:", result)
        except Exception as e:
            print("Redis error:", e)
        return {
            "message": "OTP sent to your email. Please verify to log in.",
            "Success": True
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/super_admin/verify-login-otp")
async def verify_login_otp(
    request: Request,
    email: str = Body(...),
    otp: str = Body(...),
    db: Session = Depends(get_db)
):
    if not email or not otp:
        raise HTTPException(status_code=400, detail="Email and OTP are required")

    # Headers for device tracking
    user_agent = request.headers.get("user-agent")
    device_id = request.headers.get("device-id") or str(uuid4())

    # Verify OTP
    valid = verify_otp(f"login:{email}", otp, "login")
    if not valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    # Get super_admin_id from Redis (temp store)
    admin_id = redis_client.get(f"temp:login:{email}")
    if not admin_id:
        raise HTTPException(status_code=400, detail="Session expired")

    # Validate admin in DB
    check_admin = db.execute(
        text("SELECT * FROM super_admin WHERE super_admin_id = :id"),
        {"id": admin_id}
    ).fetchone()

    if not check_admin:
        raise HTTPException(status_code=400, detail="Admin Not Found")

    # Device info (optional logging)
    parsed_info = user_agent_parser.Parse(user_agent)
    device_info = {
        "os": f"{parsed_info['os']['family']} {parsed_info['os']['major'] or ''}",
        "browser": f"{parsed_info['user_agent']['family']} {parsed_info['user_agent']['major'] or ''}",
        "platform": parsed_info["device"]["family"]
    }

    # Create JWT
    payload = {
        "id": check_admin.super_admin_id,
        "iat": int(time.time())
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    # Save session in Redis
    redis_key = f"session:{check_admin.super_admin_id}:{device_id}"
    redis_client.setex(redis_key, SESSTION_TTL, token)
    redis_client.setex(f"device-info:{check_admin.super_admin_id}:{device_id}", SESSTION_TTL, json.dumps(device_info))

    # Cleanup OTP keys
    redis_client.delete(f"otp:login:{email}")
    redis_client.delete(f"temp:login:{email}")

    # ✅ Set cookies
    response = JSONResponse({
        "message": "SuperAdmin Logged In Successfully!",
        "Success": True,
        "deviceInfo": device_info
    })
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,       # set True in production (HTTPS required)
        samesite="Strict",
        max_age=SESSTION_TTL
    )
    response.set_cookie(
        key="device_id",
        value=device_id,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=SESSTION_TTL
    )

    return response


# get super admin 
@router.get("/super_admin/get-details")
async def get_super_admin(
    admin: SuperAdmin = Depends(access_check),  # Ensure super admin is authenticated
    db: Session = Depends(get_db)
):
    return {
        "success": True,
        "message": "Super Admin fetched successfully",
        "data": {
            "super_admin_id": admin.super_admin_id,
            "email": admin.email,
            "username": admin.username,
            "created_at": admin.created_at,
            "updated_at": admin.updated_at,
        }
    }


    


# super admin creted admin with name email password and wallet address

@router.post("/super_admin/create-admin")
async def create_admin(
    admin_data: SuperAdminCreatesAdmin,
    admin: SuperAdmin = Depends(access_check),  # Ensure super admin is authenticated
    db: Session = Depends(get_db)
):
    try:
        # Step 1: Generate a new wallet for the Admin
        new_acct = w3.eth.account.create()
        encrypted_pk = encrypt_private_key(new_acct.key.hex())  
        tx_hash = send_avax(new_acct.address, 0.3)  # Fund wallet with AVAX

        # Step 2: Hash password
        hashed_password = hash_password(admin_data.password)
        admin_id = generateIdForAdmin()

        # Step 3: Insert into DB
        db.execute(
            text("""
                INSERT INTO admin (admin_id, name, email, password, election_id, wallet_address, wallet_secret, admin_of_state)
                VALUES (:admin_id, :name, :email, :password, :election_id, :wallet_address, :wallet_secret, :admin_of_state)
            """),
            {
                "admin_id": admin_id,
                "name": admin_data.name,
                "email": admin_data.email,
                "password": hashed_password,
                "election_id": admin_data.election_id,
                "wallet_address": new_acct.address,
                "wallet_secret": encrypted_pk,
                "admin_of_state": admin_data.admin_of_state
            }
        )
        db.execute(
            text("""
                INSERT INTO super_admins_logs (super_admin_id, action_title, action , status)
                VALUES (:super_admin_id, :action_title, :action, :status)
            """),
            {
                "super_admin_id": admin.super_admin_id,
                "action_title": "Created Admin",
                "action": f"Created admin {admin_data.name} with email {admin_data.email}",
                "status": "Success"
            }
        )
        db.commit()

        # Step 4: Register this admin on blockchain (superadmin calls the contract)
        # Step 4: Register this admin on blockchain
        superadmin_address = os.getenv("PUBLIC_ADDRESS_SUPER_ADMIN")
        superadmin_private_key = os.getenv("PRIVATE_KEY_SUPER_ADMIN")

        nonce = w3.eth.get_transaction_count(superadmin_address)

        txn = contract.functions.addAdmin(new_acct.address).build_transaction({
            'from': superadmin_address,
            'nonce': nonce,
            'gas': 300000,
            'gasPrice': w3.to_wei("25", "gwei")
        })

        signed_txn = w3.eth.account.sign_transaction(txn, private_key=superadmin_private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        return {
            "Success": True,
            "message": "Admin created successfully",
            "wallet_address": new_acct.address,
            "tx_hash": receipt.transactionHash.hex()
        }

    except Exception as e:
        db.rollback()
        # Yaha pe log insert karo failed ke saath
        try:
            db.execute(
                text("""
                    INSERT INTO super_admins_logs (super_admin_id, action_title, action, status)
                    VALUES (:super_admin_id, :action_title, :action, :status)
                """),
                {
                    "super_admin_id": admin.super_admin_id,
                    "action_title": "Create Admin Failed",
                    "action": f"Failed to create admin {admin_data.name} with email {admin_data.email}. Reason: {str(e)}",
                    "status": "failed"
                }
            )
            db.commit()
        except:
            db.rollback()  # agar logging bhi fail ho jaye toh crash na kare

        raise HTTPException(status_code=500, detail=f"Failed to create admin: {str(e)}")
    
# superadmin get all candidates using state passing as query parameter


@router.get("/super_admin/candidates")
def get_candidates_by_state(
    db: Session = Depends(get_db),
    admin=Depends(access_check),  # Only superadmin access
    redis: redis.Redis = Depends(get_redis)
):
    try:
        # Create a unique cache key per admin
        cache_key = f"superadmin:{admin.super_admin_id}:candidates"

        # Check cache
        cached_data = redis.get(cache_key)
        if cached_data:
            candidates = json.loads(cached_data)
            return {
                "Success": True,
                "message": "Candidates fetched successfully from cache",
                "data": candidates
            }

        # Fetch candidates from DB
        query = text("SELECT * FROM candidate")
        result = db.execute(query).mappings().fetchall()
        if not result:
            return {"Success": True, "message": "No candidates found", "data": []}

        candidates = [dict(row) for row in result]

        # Cache data with a TTL (30 seconds)
        redis.setex(cache_key, 30, json.dumps(candidates, default=json_serializer_for_time))

        return {"Success": True, "message": "Candidates fetched successfully", "data": candidates}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# get candidate counts by state for all 36 states/UTs

@router.get("/super_admin/candidates-by-state")
async def get_candidate_counts_by_state(
    db: Session = Depends(get_db),
    admin=Depends(access_check)
):
    try:
        # Define all 36 states/UTs
        labels = [
            'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
            'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
            'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
            'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
            'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
            'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
            'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
            'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
        ]

        # Query to count candidates grouped by state
        query = text("""
            SELECT candidate_state, COUNT(*) as count 
            FROM candidate 
            GROUP BY candidate_state
        """)
        result = db.execute(query).mappings().fetchall()

        # Convert result to dict for quick lookup
        state_counts = {row['candidate_state']: row['count'] for row in result}

        # Match counts to labels, default to 0 if state is missing
        data = [state_counts.get(state, 0) for state in labels]

        return {
            "Success": True,
            "message": "Candidate counts by state fetched successfully",
            "labels": labels,
            "data": data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get all admins
@router.get("/super_admin/all-admins")
async def get_candidates_by_state(
    db: Session = Depends(get_db),
    admin=Depends(access_check)  # Only superadmin access
):
    try:
        # Fetch candidates for the given state
        query = text("SELECT  admin_id , name , email , profile_picture , admin_of_state FROM admin")
        result = db.execute(query).mappings().fetchall()

        if not result:
            return {"Success": True, "message": f"No Admis found", "data": []}

        # Convert result to list of dicts
        admins = [dict(row) for row in result]

        return {"Success": True, "message": "Candidates fetched successfully", "data": admins}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    




