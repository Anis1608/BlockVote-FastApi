from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks,  Request, Body
from sqlalchemy.orm import Session
from web3 import Web3
from database.db import get_db
from middleware.security import access_check_for_admin
from ua_parser import user_agent_parser
from dotenv import load_dotenv
from database.db import redis_client
from utils.otp_on_email import generate_otp, send_otp_email, verify_otp, store_otp_in_redis
from utils.id_generator import generateIdForCandidate
from fastapi.responses import JSONResponse
from sqlalchemy import text
from uuid import uuid4
import jwt
import time
import os
import json

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")

SESSTION_TTL = int(os.getenv("SESSION_TTL", 3600))  # Default to 1 hour

# routes for admin login using otp 

router = APIRouter()


with open("./deploy-contract/Voting_abi.json", "r") as f:
    abi = json.load(f)

RPC = os.getenv("AVAX_RPC")  # Fuji RPC
w3 = Web3(Web3.HTTPProvider(RPC))

from cryptography.fernet import Fernet



FUNDING_KEY = os.getenv("FUNDING_KEY")  # Private key of funding wallet

# ------------------ Web3 Setup ------------------
funding_account = w3.eth.account.from_key(FUNDING_KEY)

contract_address = os.getenv("SMART_CONTRACT_ADDRESS")
contract = w3.eth.contract(address=contract_address, abi=abi)

FERNET_KEY = os.getenv("FERNET_KEY")
fernet = Fernet(FERNET_KEY.encode())
def decrypt_private_key(encrypted_pk: str) -> str:
    return fernet.decrypt(encrypted_pk.encode()).decode()

@router.post("/admin/admin-login-request")
async def admin_login(
    request: Request ,
    name: str = Body(..., min_length=3, max_length=50, description="Username of the admin"),
    email: str = Body(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Email address of the admin"),
    password: str = Body(..., min_length=8, description="Password for the admin account"), 
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None
    ):

    try:
        if not name or not email or not password:
            raise HTTPException(status_code=400, detail="Name, email, and password are required")

        admin = db.execute(
            text("SELECT * FROM admin WHERE name = :name AND email = :email"),
            {"name": name, "email": email}
        ).mappings().fetchone()
        # print("Admin found:", admin)
        adminId = admin['admin_id'] if admin else None
        # print("Admin ID:", adminId)
        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")

        # Generate OTP
        otp = generate_otp()
        background_tasks.add_task(store_otp_in_redis, email, otp , "login" )
        background_tasks.add_task(send_otp_email, email, otp)
        # send_otp_email(email, otp)

        try:
            result = redis_client.set(f"temp:login:{email}", adminId, ex=300)  # Store OTP for 5 minutes
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Redis Cloud Error: {str(e)}")
        return {
            "message": "OTP sent to admin's email",
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@router.post("/admin/verify-login-otp")
async def verify_admin_login_otp(
    request: Request,
    email: str = Body(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Email address of the admin"),
    otp: str = Body(..., description="OTP sent to the admin's email"),
    db: Session = Depends(get_db)
):
    if not email or not otp:
        raise HTTPException(status_code=400, detail="Email and OTP are required")
    
    user_agent = request.headers.get("user-agent")
    device_id = request.headers.get("device-id") or str(uuid4())

    valid = await verify_otp(email, otp , "login")
    if not valid:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    admin_id = redis_client.get(f"temp:login:{email}")
    if not admin_id:
        raise HTTPException(status_code=400, detail="Session expired or invalid")

    admin_obj = db.execute(
        text("SELECT * FROM admin WHERE admin_id = :id"),
        {"id": admin_id}
    ).mappings().fetchone()

    if not admin_obj:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    parsed_info = user_agent_parser.Parse(user_agent)
    device_info = {
        "os": f"{parsed_info['os']['family']} {parsed_info['os']['major'] or ''}",
        "browser": f"{parsed_info['user_agent']['family']} {parsed_info['user_agent']['major'] or ''}",
        "platform": parsed_info["device"]["family"]
    }

    payload = {
    "id": admin_id,
    "iat": int(time.time()) 
  }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    session_key = f"session:{admin_id}:{device_id}"
    redis_client.setex(session_key, SESSTION_TTL, token)
    redis_client.setex(f"device-info:{admin_id}:{device_id}" , SESSTION_TTL, json.dumps(device_info))

    redis_client.delete(f"otp:login:{email}")
    redis_client.delete(f"temp:login:{email}")

    response = JSONResponse({
        "message": "Admin Logged In Successfully!",
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


@router.get("/admin/get-detials")
async def get_admin_details(
    admin_data=Depends(access_check_for_admin),
    db: Session = Depends(get_db)
):
    return {
        "message": "Admin details retrieved successfully",
        "success": True,
        "data":{
            "adminId": admin_data.admin_id,
            "adminName": admin_data.name,
            "email": admin_data.email,
            "adminOfState": admin_data.admin_of_state,
            "created_at": admin_data.created_at,
            "updated_at": admin_data.updated_at,
        }
    }

# admin register candidates from his state only 
@router.post("/admin/register-candidate")
async def register_candidate(
    request: Request,
    name: str = Body(..., min_length=3, max_length=50, description="Name of the candidate"),
    email: str = Body(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Email address of the candidate"),
    aadhaar_number: str = Body(..., description="Aadhaar number of the candidate"),
    qualification: str = Body(..., description="Qualification of the candidate"),
    candidate_age: int = Body(..., ge=18, description="Age of the candidate (must be at least 18)"),
    party_name: str = Body(..., description="Name of the political party the candidate represents"),
    profile_picture: str = Body(None, description="URL of the candidate's profile picture (optional)"),
    experience: str = Body(None, description="Candidate's political experience (optional)"),
    previous_positions: str = Body(None, description="List of previous political positions held (optional)"),
    achievements: list[str] = Body(None, description="List of candidate's achievements (optional)"),
    candidate_city: str = Body(..., description="City the candidate is contesting from"),
    candidate_district: str = Body(..., description="District the candidate is contesting from"),
    manifesto: str = Body(None, description="Candidate's manifesto (optional)"),
    admin_data=Depends(access_check_for_admin),
    db: Session = Depends(get_db)
):
    if not all([name, email, aadhaar_number, qualification, candidate_age, party_name, candidate_city, candidate_district]):
        raise HTTPException(status_code=400, detail="All fields are required")

    # Check if the candidate already exists
    existing_candidate = db.execute(
        text("SELECT * FROM candidate WHERE email = :email AND aadhaar_number = :aadhaar_number"),
        {"email": email, "aadhaar_number": aadhaar_number}
    ).mappings().fetchone()

    if existing_candidate:
        raise HTTPException(status_code=400, detail="Candidate with this Aadhaar and email already exists")

    candidate_id = generateIdForCandidate()

    candidate_state = admin_data['admin_of_state']
    election_id = admin_data['election_id']
    admin_id = admin_data['admin_id']
    admin_wallet = admin_data["wallet_address"]

    # Candidate details for DB
    new_candidate = {
        "candidate_id": candidate_id,
        "admin_id": admin_id,
        "name": name,
        "email": email,
        "aadhaar_number": aadhaar_number,
        "qualification": qualification,
        "candidate_age": candidate_age,
        "profile_picture": profile_picture,
        "experience": experience,
        "previous_positions": previous_positions,
        "achievements": json.dumps(achievements) if achievements else None,
        "party_name": party_name,
        "candidate_state": candidate_state,
        "candidate_city": candidate_city,
        "candidate_district": candidate_district,
        "manifesto":manifesto,
        "election_id": election_id,
        "state": candidate_state,
    }

    try:
        # ✅ Save into DB
        db.execute(
            text("""
                INSERT INTO candidate (
                    candidate_id, admin_id, name, email, aadhaar_number, 
                    qualification, candidate_age, party_name, profile_picture, experience,
                    previous_positions, achievements, candidate_state, 
                    candidate_city, candidate_district, election_id, manifesto
                ) VALUES (
                    :candidate_id, :admin_id, :name, :email, :aadhaar_number, 
                    :qualification, :candidate_age, :party_name, :profile_picture, :experience,
                    :previous_positions, :achievements, :candidate_state, 
                    :candidate_city, :candidate_district, :election_id, :manifesto
                )
            """),
            new_candidate
        )
        db.commit()

        # ✅ Also register on blockchain
        # Candidate identifier can be unique, e.g., "name|aadhaar|party"
        candidate_identifier = candidate_id

        nonce = w3.eth.get_transaction_count(admin_wallet)
        txn = contract.functions.registerCandidate(candidate_identifier).build_transaction({
            "from": admin_wallet,
            "nonce": nonce,
            "gas": 2000000,
            "gasPrice": w3.to_wei("50", "gwei"),
        })

        # Sign and send transaction
        signed_txn = w3.eth.account.sign_transaction(txn, private_key=decrypt_private_key(admin_data["wallet_secret"]))
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

        return {
            "message": "Candidate registered successfully",
            "success": True,
            "candidate_id": candidate_id,
            "transaction_hash": tx_hash.hex(),
            "blockchain_status": receipt.status
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error registering candidate: {str(e)}")

@router.get("/admin/get-candidates")
async def get_candidates(
    admin_data= Depends(access_check_for_admin),
    db: Session = Depends(get_db)
):
    election_id = admin_data['election_id']
    candidates = db.execute(
        text("SELECT * FROM candidate WHERE election_id = :election_id"),
        {"election_id": election_id}
    ).mappings().fetchall()

    if not candidates:
        raise HTTPException(status_code=404, detail="No candidates found for this election")

    return {
        "message": "Candidates retrieved successfully",
        "success": True,
        "candidates": [dict(candidate) for candidate in candidates]
    }



@router.get("/admin/admin-results")
async def get_results(admin_data=Depends(access_check_for_admin)):
    try:
        admin_wallet = admin_data["wallet_address"]
        # print(contract.functions.getAllCandidates(admin_wallet).call())

        # Call contract function: returns (candidate_ids[], votes[])
        candidates, votes = contract.functions.getCandidatesWithVotes(admin_wallet).call()

        results = []
        for i in range(len(candidates)):
            results.append({
                "candidate_id": candidates[i],
                "votes": votes[i]
            })

        return {
            "status": "success",
            "admin": admin_wallet,
            "results": results
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

 





