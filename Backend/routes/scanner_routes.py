import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from database.db import redis_client


load_dotenv()

router = APIRouter()


class ScanData(BaseModel):
    device_id: str
    scan_data: str
    timestamp: str


class StatusData(BaseModel):
    device_id: str
    connected: bool
    timestamp: str

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