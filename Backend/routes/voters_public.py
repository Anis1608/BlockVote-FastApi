import json
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks , Body, File, Query, UploadFile, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.db import get_db
from dotenv import load_dotenv
from database.db import redis_client
from utils.otp_on_email import  generate_otp, send_otp_email, verify_otp, store_otp_in_redis
from utils.voter_card_sending_queue import enqueue_voter_card_email
from sqlalchemy import text
from utils.id_generator import generateIdForVoters
import cloudinary.uploader


load_dotenv()

router = APIRouter()


class EmailSchema(BaseModel):
    email: str

@router.post("/voter/send_otp")
async def send_otp(data: EmailSchema, background_tasks: BackgroundTasks):
    try:
        email = data.email
        if not email:
            raise HTTPException(status_code=400, detail="Email required")

        otp = generate_otp()

        background_tasks.add_task(store_otp_in_redis, email, otp, "register")
        background_tasks.add_task(send_otp_email, email, otp)

        return {"message": "OTP sent successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.post("/voter/verify_otp")
async def verify_otp_api(email: str = Body(...), otp: str = Body(...)):
    try:
        if not email or not otp:
            raise HTTPException(status_code=400, detail="Email and OTP required")
        
        print("nter :" , otp)

        if not await verify_otp(email, otp, "register"):
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")

        redis_client.setex(f"otp_verified:{email}", 600, "true")
        return {"message": "OTP verified successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")




@router.post("/voter/register")
async def voter_register(
    name: str = Form(...),
    father_name: str = Form(...),
    gender: str = Form(...),
    email: str = Form(...),
    contact_number: str = Form(None),
    aadhaar: str = Form(...),
    voter_dob: str = Form(...),
    voters_state: str = Form(...),
    voters_city: str = Form(...),
    voters_district: str = Form(...),
    pincode: str = Form(...),
    profile_picture: UploadFile = File(None),
    signature: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    try:
        if not redis_client.get(f"otp_verified:{email}"):
            raise HTTPException(status_code=400, detail="OTP not verified or expired")

        existing_voter = db.execute(
            text("SELECT * FROM voterstable WHERE aadhaar = :aadhaar OR email = :email"),
            {"aadhaar": aadhaar, "email": email}
        ).mappings().fetchone()

        if existing_voter:
            raise HTTPException(status_code=400, detail="Voter already exists")

        profile_url, signature_url = None, None

        if profile_picture:
            result = cloudinary.uploader.upload(profile_picture.file, folder="voters/profile")
            profile_url = result["secure_url"]

        if signature:
            result = cloudinary.uploader.upload(signature.file, folder="voters/signatures")
            signature_url = result["secure_url"]

        voter_id = generateIdForVoters()
        db.execute(
            text("""INSERT INTO voterstable 
                    (voter_id, aadhaar, name, father_name, gender, email, contact_number, profile_picture, 
                     signature, voter_dob, voters_state, voters_city, voters_district , pincode)
                    VALUES (:voter_id, :aadhaar, :name, :father_name, :gender, :email, 
                     :contact_number, :profile_picture, :signature, :voter_dob, :voters_state, :voters_city, :voters_district, :pincode  )
            """),
            {
                "voter_id": voter_id,
                "aadhaar": aadhaar,
                "name": name,
                "father_name": father_name,
                "gender": gender,
                "email": email,
                "contact_number": contact_number,
                "profile_picture": profile_url,
                "signature": signature_url,
                "voter_dob": voter_dob,
                "voters_state": voters_state,
                "voters_city": voters_city,
                "voters_district": voters_district,
                "pincode": pincode
            }
        )
        db.commit()
        enqueue_voter_card_email(voter_id, name, father_name, voter_dob, profile_url, signature_url, email)
        redis_client.delete(f"otp_verified:{email}")

        return {"message": "Voter registered successfully", "voter_id": voter_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    


# view voter details 

@router.get("/voter/details/{voter_id}")
async def get_voter_details(voter_id: str, db: Session = Depends(get_db)):
    try:
        voter = db.execute(
            text("SELECT voter_id, name, father_name, gender, voter_dob, voters_state, voters_city, voters_district FROM voterstable WHERE voter_id = :voter_id"),
            {"voter_id": voter_id}
        ).mappings().fetchone()

        if not voter:
            raise HTTPException(status_code=404, detail="Voter not found")

        return {"voter": voter}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# display all candidates details from there ids

@router.get("/candidates/details/{candidate_state}")
async def get_candidates_details(candidate_state: str, db: Session = Depends(get_db)):
    try:
        if not candidate_state:
            raise HTTPException(status_code=400, detail="Candidate states required")
        
        cache_key = f"candidates_in_{candidate_state}"
        cached_data = redis_client.get(cache_key)
        if cached_data:
            print("data from redis cache")
            return {"candidates": eval(cached_data)}
        
        print("candidate_state", candidate_state)

        candidates = db.execute(
            text("SELECT  name,  profile_picture , qualification  , candidate_age ,  party_name , experience,  previous_positions,  achievements, candidate_state , candidate_city ,  candidate_district, manifesto  FROM candidate WHERE candidate_state = (:candidate_state)"),
            {"candidate_state": candidate_state}
        ).mappings().fetchall()

        if not candidates:
            raise HTTPException(status_code=404, detail="No candidates found for the specified state")
        
        redis_client.setex(cache_key, 60, str([dict(row) for row in candidates]))
        
        return {"candidates": candidates}
    except Exception as e:
        print("error aaya hai", e)
        raise HTTPException(status_code=500, detail=str(e))
    


# # @router.put("/voter/update")
# # async def update_voter(
# #     aadhaar: str = Body(...),
# #     name: str = Body(None),
# #     email: str = Body(None),
# #     profile_picture: str = Body(None),
# #     voter_dob: str = Body(None),
# #     voters_state: str = Body(None),
# #     voters_city: str = Body(None),
# #     voters_district: str = Body(None),
# #     db: Session = Depends(get_db)
# # ):
# #     try:
# #         # Check if voter exists
# #         existing_voter = db.execute(
# #             text("SELECT * FROM votertable WHERE aadhaar = :aadhaar"),
# #             {"aadhaar": aadhaar}
# #         ).mappings().fetchone()

# #         if not existing_voter:
# #             raise HTTPException(status_code=404, detail="Voter not found")
        
# #         # Prepare update query dynamically based on provided fields
# #         update_fields = {}
# #         if name: update_fields["name"] = name
# #         if email: update_fields["email"] = email
# #         if profile_picture: update_fields["profile_picture"] = profile_picture
# #         if voter_dob: update_fields["voter_dob"] = voter_dob
# #         if voters_state: update_fields["voters_state"] = voters_state
# #         if voters_city: update_fields["voters_city"] = voters_city
# #         if voters_district: update_fields["voters_district"] = voters_district
        
# #         if not update_fields:
# #             raise HTTPException(status_code=123, detail="No fields provided for update")
        
# #         # Build SQL query
# #         set_clause = ", ".join([f"{field} = :{field}" for field in update_fields])
# #         update_fields["aadhaar"] = aadhaar  # Add voter_id for WHERE clause
        
        
# #         db.execute(
# #             text(f"UPDATE votertable SET {set_clause}, updated_at = NOW() WHERE aadhaar = :aadhaar"),
# #             {"aadhaar" : aadhaar}
# #             # update_fields
# #         )
# #         db.commit()

# #         return {"message": "Voter updated successfully"}

# #     except Exception as e:
# #         db.rollback()
# #         raise HTTPException(status_code=500, detail=str(e))

