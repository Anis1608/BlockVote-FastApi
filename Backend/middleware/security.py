from fastapi import Depends, HTTPException, Request
import jwt
from sqlalchemy import text
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import SuperAdmin  # Your SQLAlchemy Admin model
import os
import dotenv
from database.db import redis_client

# Load environment variables
dotenv.load_dotenv()

# JWT configuration
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM")
SESSION_TTL = int(os.getenv("SESSION_TTL"))  # Default to 1 hour




def access_check(request: Request, db: Session = Depends(get_db)):
    token = None
    device_id = request.headers.get("device-id")

    # Get Bearer token from Authorization header
    auth_header = request.headers.get("authorization")
    if auth_header:
        parts = auth_header.split(" ")
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
    # print("Token:", token)

    if not token or not device_id:
        raise HTTPException(status_code=401, detail="Token or Device ID missing")

    try:
        # Decode JWT
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # print("Decoded JWT:", decoded)
    
        admin_id = decoded.get("id")
        # print("Admin ID from token:", admin_id)

        if not admin_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        # Redis keys
        session_key = f"session:{admin_id}:{device_id}"
        device_info_key = f"device-info:{admin_id}:{device_id}"

        redis_token = redis_client.get(session_key)
        if not redis_token or redis_token != token:
            raise HTTPException(status_code=401, detail="Session invalid or expired")

        # Refresh TTL
        redis_client.setex(session_key, SESSION_TTL, token)
        existing_device_info = redis_client.get(device_info_key)
        if existing_device_info:
            redis_client.setex(device_info_key, SESSION_TTL, existing_device_info)

        # Fetch admin from sql dataabse
        admin_obj  = db.execute(
        text("SELECT * FROM super_admin WHERE super_admin_id = :id"),
        {"id": admin_id}
        ).fetchone()

        # print("Admin Object:", admin_obj)

        if not admin_obj:
            raise HTTPException(status_code=404, detail="Admin not found")

        return admin_obj

    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")




def access_check_for_admin(request: Request, db: Session = Depends(get_db)):
    token = None
    device_id = request.headers.get("device-id")

    # Get Bearer token from Authorization header
    auth_header = request.headers.get("authorization")
    if auth_header:
        parts = auth_header.split(" ")
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
    # print("Token:", token)

    if not token or not device_id:
        raise HTTPException(status_code=401, detail="Token or Device ID missing")

    try:
        # Decode JWT
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # print("Decoded JWT:", decoded)
    
        admin_id = decoded.get("id")
        # print("Admin ID from token:", admin_id)

        if not admin_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        # Redis keys
        session_key = f"session:{admin_id}:{device_id}"
        device_info_key = f"device-info:{admin_id}:{device_id}"

        redis_token = redis_client.get(session_key)
        if not redis_token or redis_token != token:
            raise HTTPException(status_code=401, detail="Session invalid or expired")

        # Refresh TTL
        redis_client.setex(session_key, SESSION_TTL, token)
        existing_device_info = redis_client.get(device_info_key)
        if existing_device_info:
            redis_client.setex(device_info_key, SESSION_TTL, existing_device_info)

        # Fetch admin from sql dataabse
        admin_obj  = db.execute(
        text("SELECT * FROM admin WHERE admin_id = :id"),
        {"id": admin_id}
        ).mappings().fetchone()


        if not admin_obj:
            raise HTTPException(status_code=404, detail="Admin not found")

        return admin_obj

    except:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
