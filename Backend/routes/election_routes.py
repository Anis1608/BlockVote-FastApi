from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime, timezone
from database.db import get_db
from database.models import Elections
from middleware.security import access_check
from datetime import datetime, time, timezone, timedelta
from datetime import datetime
from pydantic import BaseModel


def get_current_phase(reg_start: datetime, voting_date: datetime, result_date: datetime) -> str:
    now = datetime.now(timezone.utc) 
    if reg_start <= now < voting_date:
        return "registration"
    elif voting_date <= now < result_date:
        return "voting"
    else:
        return "result"

# Indian Standard Time (UTC+5:30)
IST = timezone(timedelta(hours=5, minutes=30))

def normalize_date(date_str: str) -> datetime:
    """
    Convert input (YYYY-MM-DD or full ISO) into datetime at 00:00 IST.
    """
    try:
        # Case 1: Only YYYY-MM-DD (no time given)
        if len(date_str) == 10:
            dt = datetime.strptime(date_str, "%Y-%m-%d")
            return datetime.combine(dt.date(), time(0, 0), tzinfo=IST)
        
        # Case 2: Full ISO datetime (with or without Z)
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        # Convert to IST
        return dt.astimezone(IST)

    except Exception:
        raise ValueError("Invalid date format. Use YYYY-MM-DD or ISO format.")

class ElectionCreate(BaseModel):
    title: str
    description: str | None = None
    election_state: str
    registration_start_date: str   # allow YYYY-MM-DD
    voting_date: str
    result_published_date: str



router = APIRouter()

@router.post("/super_admin/create-elections")
async def create_election(
    election: ElectionCreate,
    db: Session = Depends(get_db),
    admin=Depends(access_check)
):
    try:
        reg_start = normalize_date(election.registration_start_date)
        voting_date = normalize_date(election.voting_date)
        result_date = normalize_date(election.result_published_date)

        # Rule checks
        if voting_date <= reg_start:
            raise HTTPException(
                status_code=400,
                detail="Voting date must be after registration start date"
            )
        if result_date <= voting_date:
            raise HTTPException(
                status_code=400,
                detail="Result publish date must be after voting date"
            )

        # Auto-phase
        current_phase = get_current_phase(reg_start, voting_date, result_date)

        new_election = Elections(
            title=election.title,
            description=election.description,
            election_state=election.election_state,
            registration_start_date=reg_start,
            voting_date=voting_date,
            result_published_date=result_date,
            current_phase=current_phase
        )

        db.add(new_election)
        db.commit()
        db.refresh(new_election)

        return {
            "success": True,
            "message": "Election created successfully",
            "data": {
                "election_id": new_election.election_id,
                "title": new_election.title,
                "state": new_election.election_state,
                "registration_start_date": str(new_election.registration_start_date),
                "voting_date": str(new_election.voting_date),
                "result_published_date": str(new_election.result_published_date),
                "current_phase": new_election.current_phase
            }
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
