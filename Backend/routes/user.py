from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from database.db import get_db
from pydantic_models.User import User

router = APIRouter()

# Create table
@router.post("/create-table")
def create_table(db: Session = Depends(get_db)):
    try:
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS anis (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100)
            )
        """))
        db.commit()
        return {"message": "✅ Table created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get all users
@router.get("/users")
def get_users(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT e.name  as anis_name, p.name as kirshna_name from anis e join krishna p on e.id = p.id")).fetchall()
    return [dict(row._mapping) for row in result]

# Insert a user
@router.post("/users")
def insert_user(user: User, db: Session = Depends(get_db)):
    try:
        result = db.execute(
            text("INSERT INTO krishna (id, name) VALUES (:id, :name) RETURNING *"),
            {"id": user.id, "name": user.name}
        )
        db.commit()
        return dict(result.fetchone()._mapping)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
