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

        if not verify_otp(email, otp, "register"):
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
        # ✅ OTP verification check
        if not redis_client.get(f"otp_verified:{email}"):
            raise HTTPException(status_code=400, detail="OTP not verified or expired")

        # ✅ Duplicate voter check
        existing_voter = db.execute(
            text("SELECT * FROM voterstable WHERE aadhaar = :aadhaar OR email = :email"),
            {"aadhaar": aadhaar, "email": email}
        ).mappings().fetchone()

        if existing_voter:
            raise HTTPException(status_code=400, detail="Voter already exists")

        # ✅ Upload to Cloudinary
        profile_url, signature_url = None, None

        if profile_picture:
            result = cloudinary.uploader.upload(profile_picture.file, folder="voters/profile")
            profile_url = result["secure_url"]

        if signature:
            result = cloudinary.uploader.upload(signature.file, folder="voters/signatures")
            signature_url = result["secure_url"]

        # ✅ Insert into DB
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
    












class ScanData(BaseModel):
    device_id: str
    scan_data: str
    timestamp: str


class StatusData(BaseModel):
    device_id: str
    connected: bool
    timestamp: str


# class ScanData(BaseModel):
#     device_id: str
#     scan_data: str
#     timestamp: str

@router.post("/scanner")
def receive_scan(data: ScanData):
    try:
        cache_key = f"scan_{data.device_id}"
        existing = redis_client.get(cache_key)

        if existing:
            existing_data = eval(existing)
            last_scan = existing_data[-1]

            if last_scan['scan_data'] == data.scan_data:
                return {"status": "ignored", "message": "Duplicate scan, not updated."}
            else:
                redis_client.delete(cache_key)

        # Save new data
        redis_client.setex(cache_key, 60, str([data.dict()]))

        # Publish event
        redis_client.publish(f"channel:{data.device_id}", json.dumps(data.dict()))

        return {"status": "success", "data": data.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# API to receive device status from scanner
@router.post("/device-status")
def receive_status(status: StatusData):
    try:
        key = f"status:{status.device_id}"
        redis_client.setex(key, 10 , json.dumps(status.dict()))
        return {"message": "Status stored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.get("/device-status/{device_id}")
def get_status(device_id: str):
    try:
        key = f"status:{device_id}"
        data = redis_client.get(key)
        if not data:
            return False
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# @router.post("/voter/register_request")
# async def voter_register_request(
#     request: Request,
#     name: str = Body(...),
#     father_name: str = Body(...),
#     email: str = Body(...),
#     aadhaar: str = Body(...),
#     voter_dob: str = Body(...),
#     voters_state: str = Body(...),
#     voters_city: str = Body(...),
#     voters_district: str = Body(...),
#     profile_picture: str = Body(None),
#     signature: str = Body(None),
#     db: Session = Depends(get_db),
# ):

#     try:
#         if not email or not aadhaar or not name or not father_name or not voter_dob or not voters_state or not voters_city or not voters_district:
#             raise HTTPException( status_code=123, detail="details required")    #voter_id and email
        
#         existing_voter = db.execute(
#             text("SELECT * FROM voterstable WHERE aadhaar = :aadhaar OR email = :email"),
#             {"aadhaar": aadhaar, "email":email}
#         ).mappings().fetchone()
        
#         # check if voter already exists
#         if existing_voter:
#             raise HTTPException(status_code=123, detail = "voter already exist")
        
#         voter_id = generateIdForVoters()
        
#         # generate otp
#         otp = generate_otp()
#         # store otp in redis
#         store_otp_in_redis(email, otp, "register")
#         # send otp to voter via email
#         send_otp_email(email, otp)
        
        
#         # Temporarily store voter data in Redis until OTP verification
#         voter_data = f"{voter_id}|{name}|{father_name}|{email}|{aadhaar}|{voter_dob}|{voters_state}|{voters_city}|{voters_district}|{profile_picture}|{signature}" 
#         redis_client.setex(f"temp:voter:{email}" , 300, voter_data  )

#         return {"message": "OTP sent to email. Please verify to complete registration."}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")
    


# @router.post("/voter/verify_register_otp")
# async def voter_register_verify(
#     email: str = Body(...),
#     otp: str = Body(...),
#     db: Session = Depends(get_db)
    
#     # request: Request,
#     # name: str = Body(...),
#     # email: str = Body(...),
#     # voter_id: str = Body(...),
#     # voter_dob: str = Body(...),
#     # voters_state: str = Body(...),
#     # voters_city: str = Body(...),
#     # voters_district: str = Body(...),
#     # profile_picture: str = Body(None),
#     # db: Session = Depends(get_db),
#     # otp: str = Body(...),
        
# ):
#     # if email or otp is empty, return error
#     if not email or not otp:
#        raise HTTPException(status_code=400, detail="Email and OTP are required")
 
#     # Verify OTP
#     if not verify_otp(email, otp, "register"):
#         raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    
#     # print("yaha tak pahuuncha hu bai",verify_otp)
    
#     retrieve_data_from_redis = redis_client.get(f"temp:voter:{email}")

#     voter_id, name, father_name, email, aadhaar, voter_dob, voters_state, voters_city, voters_district, profile_picture, signature = retrieve_data_from_redis.split("|")


    
    
#     try:
#         db.execute(
#             text(
#                 """INSERT INTO voterstable (voter_id, aadhaar, name, father_name, email, profile_picture, signature, voter_dob, voters_state, voters_city, voters_district )
#                 values 
#                 (
#                 :voter_id,
#                 :aadhaar,
#                 :name,
#                 :father_name,
#                 :email,
#                 :profile_picture,
#                 :signature,
#                 :voter_dob,
#                 :voters_state,
#                 :voters_city,
#                 :voters_district
#                 )
#                 """                
#             ),
#             {
#             "voter_id": voter_id,
#             "aadhaar": aadhaar,
#             "name": name,
#             "father_name": father_name,
#             "email": email,
#             "profile_picture": profile_picture,
#             "signature": signature,
#             "voter_dob": voter_dob,
#             "voters_state": voters_state,
#             "voters_city": voters_city,
#             "voters_district": voters_district
#             }
#         )
#         db.commit()
        
#         #voting card email send 
#         enqueue_voter_card_email(voter_id, name, father_name, voter_dob, profile_picture, signature, email)
        
        
        
#         redis_client.delete(f"temp:voter:{email}")
#         return {"message": "Voter registered successfully"}
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=500, detail=str(e))




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

