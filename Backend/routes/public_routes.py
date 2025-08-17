from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from database.db import get_db

router = APIRouter()

@router.get("/get-all/candidates")
async def get_candidates_by_state(
    state: str = Query(..., description="State to filter candidates"),
    db: Session = Depends(get_db), # Only superadmin access
):
    try:
        # Fetch candidates for the given state
        query = text("SELECT candidate_id , name , profile_picture , qualification , candidate_age , party_name FROM candidate WHERE candidate_state = :state")
        result = db.execute(query, {"state": state}).mappings().fetchall()

        if not result:
            return {"success": True, "message": f"No candidates found in state {state}", "data": []}

        # Convert result to list of dicts
        candidates = [dict(row) for row in result]

        return {"success": True, "message": "Candidates fetched successfully", "data": candidates}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
