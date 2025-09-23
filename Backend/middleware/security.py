from fastapi import Depends, HTTPException, Request
import jwt
from sqlalchemy import text
from sqlalchemy.orm import Session
from utils.json_serializer import json_serializer_for_time
from database.db import get_db
import os
import dotenv
from database.db import redis_client
import json

dotenv.load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM")
SESSION_TTL = int(os.getenv("SESSION_TTL")) 




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
        # decode token
        decoded = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = decoded.get("id")
        if not admin_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        session_key = f"session:{admin_id}:{device_id}"
        device_info_key = f"device-info:{admin_id}:{device_id}"

        # pipeline = fewer roundtrips
        pipe = redis_client.pipeline()
        pipe.get(session_key)
        pipe.get(device_info_key)
        redis_token, existing_device_info = pipe.execute()

        if not redis_token or redis_token != access_token:
            raise HTTPException(status_code=401, detail="Session invalid or expired")

        # refresh TTL only if needed
        if redis_client.ttl(session_key) < SESSION_TTL // 2:
            pipe = redis_client.pipeline()
            pipe.setex(session_key, SESSION_TTL, access_token)
            if existing_device_info:
                pipe.setex(device_info_key, SESSION_TTL, existing_device_info)
            pipe.execute()

        # cache for superadmin
        admin_cache_key = f"super-admin:{admin_id}"
        admin_obj_json = redis_client.get(admin_cache_key)

        if not admin_obj_json:
            admin_obj = db.execute(
                text("SELECT * FROM super_admin WHERE super_admin_id = :id"),
                {"id": admin_id}
            ).fetchone()

            if not admin_obj:
                raise HTTPException(status_code=404, detail="Admin not found")

            # convert SQLAlchemy Row -> dict safely
            admin_dict = dict(admin_obj._mapping)

            # cache in redis
            redis_client.setex(admin_cache_key, 3600, json.dumps(admin_dict , default=json_serializer_for_time))  # cache for 1 hour
        else:
            admin_dict = json.loads(admin_obj_json)

        return admin_dict

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {e}")































def access_check_for_admin(
    request: Request,
    db: Session = Depends(get_db),
    access_token: str = Cookie(None),
    device_id: str = Cookie(None)
):
    if not access_token or not device_id:
        raise HTTPException(status_code=401, detail="Token or Device ID missing")

    try:
    
        decoded = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = decoded.get("id")

        if not admin_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

  
        session_key = f"session:{admin_id}:{device_id}"
        device_info_key = f"device-info:{admin_id}:{device_id}"

        redis_token = redis_client.get(session_key)
        if not redis_token or redis_token != access_token:
            raise HTTPException(status_code=401, detail="Session invalid or expired")


        redis_client.setex(session_key, SESSION_TTL, access_token)
        existing_device_info = redis_client.get(device_info_key)
        if existing_device_info:
            redis_client.setex(device_info_key, SESSION_TTL, existing_device_info)


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
