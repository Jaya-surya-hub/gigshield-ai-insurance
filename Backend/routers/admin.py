from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Worker, Policy, Claim

router = APIRouter()

@router.get("/stats")
def get_insurer_stats(db: Session = Depends(get_db)):
    """Aggregates platform data for the Insurer Dashboard."""
    
    # 1. Financials
    total_premium = db.query(func.sum(Policy.weekly_premium)).filter(Policy.is_active == True).scalar() or 0.0
    total_payouts = db.query(func.sum(Claim.payout_amount)).filter(Claim.status == 'APPROVED').scalar() or 0.0
    
    loss_ratio = (total_payouts / total_premium) * 100 if total_premium > 0 else 0.0

    # 2. Claim Analytics
    total_claims = db.query(func.count(Claim.id)).scalar() or 0
    flagged_claims = db.query(func.count(Claim.id)).filter(Claim.status == 'FLAGGED_FOR_LAV').scalar() or 0
    
    # 3. Zone Distribution
    peelamedu_count = db.query(func.count(Worker.id)).filter(Worker.home_zone_id == 'COIMBATORE_PEELAMEDU').scalar() or 0
    ukkadam_count = db.query(func.count(Worker.id)).filter(Worker.home_zone_id == 'COIMBATORE_UKKADAM').scalar() or 0

    return {
        "financials": {
            "weekly_premium_run_rate": round(total_premium, 2),
            "total_payouts": round(total_payouts, 2),
            "loss_ratio": round(loss_ratio, 1)
        },
        "claims": {
            "total_processed": total_claims,
            "fraud_prevented": flagged_claims
        },
        "zones": {
            "COIMBATORE_PEELAMEDU": peelamedu_count,
            "COIMBATORE_UKKADAM": ukkadam_count
        }
    }