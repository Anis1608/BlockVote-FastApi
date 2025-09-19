from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database.db import get_db
from database.models import SuperAdminLogs
from middleware.security import access_check
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

@router.get("/super_admin/logs")
async def get_super_admin_logs(
    db: Session = Depends(get_db),
    admin=Depends(access_check)  # ✅ Only superadmin access
):
    try:
        logs = db.query(SuperAdminLogs).order_by(SuperAdminLogs.timestamp.desc()).all()
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to fetch logs") from e