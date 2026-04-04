from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Worker(Base):
    __tablename__ = "workers"
    
    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, unique=True, index=True)
    platform = Column(String) # "Zomato" or "Swiggy"
    home_zone_id = Column(String, index=True) # e.g., "COIMBATORE_PEELAMEDU"
    gig_score = Column(Integer, default=50)
    is_active = Column(Boolean, default=True)
    
    policies = relationship("Policy", back_populates="worker")

class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("workers.id"))
    guidewire_policy_number = Column(String, unique=True, index=True)
    plan_tier = Column(String) # "Basic", "Full", "Total"
    weekly_premium = Column(Float)
    start_date = Column(DateTime, default=datetime.datetime.utcnow)
    end_date = Column(DateTime)
    is_active = Column(Boolean, default=True)
    
    worker = relationship("Worker", back_populates="policies")
class ZoneIFI(Base):
    __tablename__ = 'zone_ifi'
    
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(String, unique=True, index=True)
    score = Column(Float)
    reasoning = Column(String)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    worker_id = Column(Integer, ForeignKey("workers.id"))
    policy_id = Column(Integer, ForeignKey("policies.id"))
    payout_amount = Column(Float)
    status = Column(String)
    trigger_type = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)