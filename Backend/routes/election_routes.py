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


# Always use IST (UTC+5:30)
IST = timezone(timedelta(hours=5, minutes=30))

router = APIRouter()

def get_current_phase(reg_start: datetime, voting_date: datetime, result_date: datetime) -> str:
    if reg_start.tzinfo is None:
        reg_start = reg_start.replace(tzinfo=IST)
    if voting_date.tzinfo is None:
        voting_date = voting_date.replace(tzinfo=IST)
    if result_date.tzinfo is None:
        result_date = result_date.replace(tzinfo=IST)

    # Always compare in IST
    now = datetime.now(IST)

    if reg_start <= now < voting_date:
        return "registration"
    elif voting_date <= now < result_date:
        return "voting"
    else:
        return "result"

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
    


# update election Details api endpoint here 

class ElectionUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    election_state: str | None = None
    registration_start_date: str | None = None
    voting_date: str | None = None
    result_published_date: str | None = None

@router.put("/super_admin/update-election/{election_id}")
async def update_election(
    election_id: int,
    election: ElectionUpdate,
    db: Session = Depends(get_db),
    admin=Depends(access_check)
):
    try:
        # Check if election exists
        db_election = db.query(Elections).filter(Elections.election_id == election_id).first()
        if not db_election:
            raise HTTPException(status_code=404, detail="Election not found")

        # Update fields only if provided
        if election.title is not None:
            db_election.title = election.title
        if election.description is not None:
            db_election.description = election.description
        if election.election_state is not None:
            db_election.election_state = election.election_state

        # Dates (normalize if provided)
        reg_start = db_election.registration_start_date
        voting_date = db_election.voting_date
        result_date = db_election.result_published_date

        if election.registration_start_date:
            reg_start = normalize_date(election.registration_start_date)
            db_election.registration_start_date = reg_start
        if election.voting_date:
            voting_date = normalize_date(election.voting_date)
            db_election.voting_date = voting_date
        if election.result_published_date:
            result_date = normalize_date(election.result_published_date)
            db_election.result_published_date = result_date

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

        # Recalculate current phase
        db_election.current_phase = get_current_phase(reg_start, voting_date, result_date)

        db.commit()
        db.refresh(db_election)

        return {
            "success": True,
            "message": "Election updated successfully",
            "data": {
                "election_id": db_election.election_id,
                "title": db_election.title,
                "state": db_election.election_state,
                "registration_start_date": str(db_election.registration_start_date),
                "voting_date": str(db_election.voting_date),
                "result_published_date": str(db_election.result_published_date),
                "current_phase": db_election.current_phase
            }
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))





