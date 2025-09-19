from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .db import Base  # Import Base from your db.py
from sqlalchemy.sql import func
class SuperAdmin(Base):
    __tablename__ = "super_admin"

    super_admin_id = Column(String(100), primary_key=True , unique=True, index=True , nullable=False)
    username = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class Admin(Base):
    __tablename__ = "admin"

    admin_id = Column(String(100), unique=True,primary_key=True ,  nullable=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    profile_picture = Column(String(255), nullable=True)
    election_id = Column(Integer, ForeignKey("elections.election_id"))
    wallet_address = Column(String(255), unique=True, nullable=False)
    wallet_secret = Column(String(255), nullable=False)
    admin_of_state = Column(String(255), nullable=False , index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    candidates = relationship("Candidate", back_populates="admin")
    election = relationship("Elections", back_populates="admin")

 
class Elections(Base):
    __tablename__ = "elections"

    election_id = Column(Integer, primary_key=True, index=True , nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    election_state = Column(String(100), nullable=False , index=True , unique=True)
    registration_start_date = Column(DateTime, nullable=False)  
    voting_date = Column(DateTime, nullable=False)
    result_published_date = Column(DateTime, nullable=False)    
    current_phase = Column(String(100), nullable=False) 
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    admin = relationship("Admin", back_populates="election")
    candidates = relationship("Candidate", back_populates="election")




class Candidate(Base):
    __tablename__ = "candidate"

    candidate_id = Column(String(100), primary_key=True, nullable=False, index=True)
    admin_id = Column(String(100), ForeignKey("admin.admin_id"), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    aadhaar_number = Column(String(12), unique=True, nullable=False)
    profile_picture = Column(String(255), nullable=True)
    qualification = Column(String(255), nullable=False)
    candidate_age = Column(Integer, nullable=False)
    party_name = Column(String(100), nullable=False)
    candidate_state = Column(String(100), nullable=False , index=True)
    candidate_city = Column(String(100), nullable=False)
    candidate_district = Column(String(100), nullable=False)
    manifesto = Column(String(500), nullable=True)
    election_id = Column(Integer, ForeignKey("elections.election_id"))
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    election = relationship("Elections" , back_populates="candidates")
    admin = relationship("Admin", back_populates="candidates")


class VotersTable(Base):
    __tablename__ = "voterstable"

    voter_id = Column(String(20), primary_key=True, index=True)
    aadhaar = Column(String(12), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    father_name = Column(String(100), nullable=False)
    gender = Column(String(10), nullable=False)
    contact_number = Column(String(15), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    profile_picture = Column(String(255), nullable=True)
    signature = Column(String(255), nullable=True)
    voter_dob = Column(DateTime, nullable=False)
    voters_state = Column(String(100), nullable=False)
    voters_city = Column(String(100), nullable=False)
    voters_district = Column(String(100), nullable=False)
    pincode = Column(String(10), nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class SuperAdminLogs(Base):
    __tablename__ = "super_admins_logs"

    log_id = Column(Integer, primary_key=True, index=True , nullable=False)
    super_admin_id = Column(String(100), ForeignKey("super_admin.super_admin_id"), nullable=False)
    action_title = Column(String(255), nullable=False)
    action = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="Success")
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)

    super_admin = relationship("SuperAdmin")




