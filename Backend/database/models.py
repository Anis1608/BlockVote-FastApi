from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base  # Import Base from your db.py
from sqlalchemy.sql import func
from utils.id_generator import generateIdForSuperAdmin , generateIdForAdmin , generateIdForCandidate ,  generateIdForVoters  # Import your ID generator function
class SuperAdmin(Base):
    __tablename__ = "super_admin"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    super_admin_id = Column(String(100), unique=True, nullable=False , default=generateIdForSuperAdmin())
    username = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True, index=True)
    admin_id = Column(String(100), unique=True, nullable=True , default=generateIdForAdmin())
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    profile_picture = Column(String(255), nullable=True)
    election_id = Column(Integer, ForeignKey("election.id"))
    wallet_address = Column(String(255), unique=True, nullable=False)
    wallet_secret = Column(String(255), nullable=False)
    admin_of_state = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    super_admin = relationship("SuperAdmin")
    candidates = relationship("Candidate", back_populates="admin")


class Voter(Base):
    __tablename__ = "voters"

    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(String(100), unique=True, nullable=False , default=generateIdForVoters)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    profile_picture = Column(String(255), nullable=True)
    voter_dob = Column(DateTime, nullable=False)
    voters_state = Column(String(100), nullable=False)
    voters_city = Column(String(100), nullable=False)
    voters_district = Column(String(100), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

 
class Election(Base):
    __tablename__ = "election"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(500))
    election_state = Column(String(100), nullable=False)
    start_date = Column(DateTime, nullable=False)  
    end_date = Column(DateTime, nullable=False)    
    current_phase = Column(String(100), nullable=True) 
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)



class Candidate(Base):
    __tablename__ = "candidate"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(String(100), unique=True, nullable=False, default=generateIdForCandidate)
    admin_id = Column(String(100), ForeignKey("admin.admin_id"), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    aadhaar_number = Column(String(12), unique=True, nullable=False)
    profile_picture = Column(String(255), nullable=True)
    qualification = Column(String(255), nullable=False)
    candidate_age = Column(Integer, nullable=False)
    party_name = Column(String(100), nullable=False)
    candidate_state = Column(String(100), nullable=False)
    candidate_city = Column(String(100), nullable=False)
    candidate_district = Column(String(100), nullable=False)
    manifesto = Column(String(500), nullable=True)
    election_id = Column(Integer, ForeignKey("election.id"))
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    election = relationship("Election")
    admin = relationship("Admin", back_populates="candidates")
