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




from fastapi import Cookie

from fastapi import Request, Depends, HTTPException, Cookie
from sqlalchemy.orm import Session
from sqlalchemy import text
import jwt

def access_check(
    request: Request,
    db: Session = Depends(get_db),
    access_token: str = Cookie(None),
    device_id: str = Cookie(None)
):
    if not access_token or not device_id:
        raise HTTPException(status_code=401, detail="Token or Device ID missing")

    try:
        # Decode JWT
        decoded = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = decoded.get("id")
        print("admin Id : " , admin_id)
        if not admin_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        # Redis session check
        session_key = f"session:{admin_id}:{device_id}"
        device_info_key = f"device-info:{admin_id}:{device_id}"

        redis_token = redis_client.get(session_key)
        if not redis_token or redis_token != access_token:
            raise HTTPException(status_code=401, detail="Session invalid or expired")

        # Refresh TTL
        redis_client.setex(session_key, SESSION_TTL, access_token)
        existing_device_info = redis_client.get(device_info_key)
        if existing_device_info:
            redis_client.setex(device_info_key, SESSION_TTL, existing_device_info)

        # Fetch admin from DB
        admin_obj = db.execute(
            text("SELECT * FROM super_admin WHERE super_admin_id = :id"),
            {"id": admin_id}
        ).fetchone()

        if not admin_obj:
            raise HTTPException(status_code=404, detail="Admin not found")

        return admin_obj

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def access_check_for_admin(
    request: Request,
    db: Session = Depends(get_db),
    access_token: str = Cookie(None),
    device_id: str = Cookie(None)
):
    if not access_token or not device_id:
        raise HTTPException(status_code=401, detail="Token or Device ID missing")

    try:
        # Decode JWT
        decoded = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = decoded.get("id")

        if not admin_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        # Redis session check
        session_key = f"session:{admin_id}:{device_id}"
        device_info_key = f"device-info:{admin_id}:{device_id}"

        redis_token = redis_client.get(session_key)
        if not redis_token or redis_token != access_token:
            raise HTTPException(status_code=401, detail="Session invalid or expired")

        # Refresh TTL
        redis_client.setex(session_key, SESSION_TTL, access_token)
        existing_device_info = redis_client.get(device_info_key)
        if existing_device_info:
            redis_client.setex(device_info_key, SESSION_TTL, existing_device_info)

        # Fetch admin from DB
        admin_obj = db.execute(
            text("SELECT * FROM admin WHERE admin_id = :id"),
            {"id": admin_id}
        ).mappings().fetchone()

        if not admin_obj:
            raise HTTPException(status_code=404, detail="Admin not found")

        return admin_obj

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
