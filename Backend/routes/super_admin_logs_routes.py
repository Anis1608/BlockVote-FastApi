from sqlalchemy import text
from fastapi import APIRouter, Depends, HTTPException
from flask import json
import redis
from sqlalchemy.orm import Session
from utils.json_serializer import json_serializer_for_time
from database.db import get_db, get_redis
from database.models import SuperAdminLogs
from middleware.security import access_check
from database.db import redis_client

router = APIRouter()

@router.get("/super_admin/logs")
def get_super_admin_logs(
    db: Session = Depends(get_db),
    admin=Depends(access_check)
):
    try:
        # Unique cache key per admin
        cache_key = f"superadmin:{admin['super_admin_id']}:logs"

        # Check Redis cache
        cached_data = redis_client.get(cache_key)
        if cached_data:
            logs = json.loads(cached_data)
            return {
                "Success": True,
                "message": "Logs fetched successfully from cache",
                "data": logs
            }

        # Fetch logs from DB using raw SQL
        query = text("SELECT * FROM super_admins_logs ORDER BY timestamp DESC")
        result = db.execute(query).mappings().fetchall()  # fetch as list of dicts

        if not result:
            return {"Success": True, "message": "No logs found", "data": []}

        logs = [dict(row) for row in result]

        # Cache the result with TTL 5 minutes
        redis_client.setex(cache_key, 30, json.dumps(logs, default=json_serializer_for_time))

        return {"Success": True, "message": "Logs fetched successfully", "data": logs}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch logs: {str(e)}")
    

































