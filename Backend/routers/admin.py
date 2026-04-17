 # gigshield-backend/routers/admin.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Worker, Policy, Claim

router = APIRouter()

@router.get('/actuarial-summary') 
def get_actuarial_summary(db: Session = Depends(get_db)):
    # Calculate premium pool financials
    total_workers = db.query(func.count(Worker.id)).filter(Worker.is_active == True).scalar() or 0
    avg_premium = db.query(func.avg(Policy.weekly_premium)).filter(Policy.is_active == True).scalar() or 0
    weekly_pool = db.query(func.sum(Policy.weekly_premium)).filter(Policy.is_active == True).scalar() or 0.0

    # Actual claim experience
    total_claims = db.query(func.count(Claim.id)).scalar() or 0
    approved_claims = db.query(func.count(Claim.id)).filter(Claim.status.in_(['APPROVED','PAID_ZERO_TOUCH'])).scalar() or 0
    total_payout = db.query(func.sum(Claim.payout_amount)).filter(Claim.status.in_(['APPROVED','PAID_ZERO_TOUCH'])).scalar() or 0.0
    avg_payout = round(total_payout / approved_claims, 2) if approved_claims > 0 else 0.0

    # Break-even and Loss Analysis
    actual_loss_ratio = round((total_payout / weekly_pool) * 100, 1) if weekly_pool > 0 else 0.0
    expense_ratio = 0.25 
    expected_claim_freq = 0.25 # claims per worker per week
    breakeven_premium = round((expected_claim_freq * avg_payout) / (1 - expense_ratio), 2) if avg_payout > 0 else 35.0

    return {
        'premium_pool': {
            'active_workers': total_workers,
            'weekly_pool_inr': round(weekly_pool, 2),
            'avg_weekly_premium_inr': round(avg_premium, 2),
            'annual_projection_inr': round(weekly_pool * 52, 2),
        },
        'claim_experience': {
            'total_claims_processed': total_claims,
            'approved_claims': approved_claims,
            'avg_payout_per_claim_inr': avg_payout,
            'total_payouts_inr': round(total_payout, 2),
        },
        'loss_analysis': {
            'actual_loss_ratio_pct': actual_loss_ratio,
            'target_loss_ratio_pct': 40.0,
            'status': 'WITHIN_TARGET' if actual_loss_ratio <= 40.0 else 'ABOVE_TARGET',
        },
        'premium_adequacy': {
            'breakeven_premium_inr': breakeven_premium,
            'current_avg_premium_inr': round(avg_premium, 2),
            'expense_ratio_assumed': expense_ratio,
        },
        'frequency_model': {
            'expected_claims_per_worker_per_week': expected_claim_freq,
            'high_ifi_zone_multiplier': 2.1,
        }
    }
