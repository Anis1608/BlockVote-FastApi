from fastapi import APIRouter, Depends, HTTPException, Request, Body
from sqlalchemy.orm import Session
from database.db import get_db
from middleware.security import access_check_for_admin
from ua_parser import user_agent_parser
from dotenv import load_dotenv
from database.db import redis_client
from utils.otp_on_email import generate_otp, send_otp_email, verify_otp, store_otp_in_redis
from utils.id_generator import generateIdForCandidate
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

@router.post("/admin/admin-login-request")
async def admin_login(
    request: Request ,
    name: str = Body(..., min_length=3, max_length=50, description="Username of the admin"),
    email: str = Body(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$', description="Email address of the admin"),
    password: str = Body(..., min_length=8, description="Password for the admin account"), 
    db: Session = Depends(get_db)):

    # Check if the admin exists
    try:
        if not name or not email or not password:
            raise HTTPException(status_code=400, detail="Name, email, and password are required")

        admin = db.execute(
            text("SELECT * FROM admin WHERE name = :name AND email = :email"),
            {"name": name, "email": email}
        ).mappings().fetchone()

        print("Admin found:", admin)

        adminId = admin['admin_id'] if admin else None

        print("Admin ID:", adminId)

        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")

        # Generate OTP
        otp = generate_otp()
        store_otp_in_redis(email, otp , "login")

        # Send OTP to admin's email
        send_otp_email(email, otp)

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

    valid = verify_otp(f"login:{email}", otp , "login")
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

    return {
        "message": "Admin logged in successfully",
        "success": True,
        "token": token,
        "device_id": device_id,
        "adminId": admin_obj['admin_id']
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
    candidate_city: str = Body(..., description="City the candidate is contesting from"),
    candidate_district: str = Body(..., description="District the candidate is contesting from"),
    admin_data= Depends(access_check_for_admin),
    db: Session = Depends(get_db)
):
    if not name or not email or not aadhaar_number or not qualification or not candidate_age or not party_name  or not candidate_city or not candidate_district:
        raise HTTPException(status_code=400, detail="All fields are required")

    # Check if the candidate already exists
    existing_candidate = db.execute(
        text("SELECT * FROM candidate WHERE email = :email AND aadhaar_number = :aadhaar_number"),
        {"email": email ,
         "aadhaar_number": aadhaar_number}
    ).mappings().fetchone()

    if existing_candidate:
        raise HTTPException(status_code=400, detail="Candidate with this aadhaar and email already exists")
    
    candidate_id = generateIdForCandidate()

    candidate_state = admin_data['admin_of_state']
    election_id = admin_data['election_id']
    admin_id = admin_data['admin_id']

    # Create new candidate
    new_candidate = {
        "candidate_id": candidate_id,
        "admin_id": admin_id,
        "name": name,
        "email": email,
        "aadhaar_number": aadhaar_number,
        "qualification": qualification,
        "candidate_age": candidate_age,
        "party_name": party_name,
        "candidate_state": candidate_state,
        "candidate_city": candidate_city,
        "candidate_district": candidate_district,
        "election_id": election_id,
        "state": candidate_state,
    }

    db.execute(
        text("INSERT INTO candidate (candidate_id , admin_id , name, email, aadhaar_number , qualification , candidate_age , party_name , candidate_state , candidate_city , candidate_district , election_id) VALUES (:candidate_id , :admin_id , :name, :email, :aadhaar_number , :qualification , :candidate_age , :party_name , :candidate_state , :candidate_city , :candidate_district , :election_id)"),
        new_candidate
    )
    db.commit()

    return {
        "message": "Candidate registered successfully",
        "success": True
    }


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

 





