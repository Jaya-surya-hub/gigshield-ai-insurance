from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Worker, Policy, Claim

router = APIRouter()

@router.get('/sustainability')
def get_sustainability_metrics(db: Session = Depends(get_db)):
    '''
    Computes BCR, 14-day monsoon stress test, and liquidity reserve.
    This answers Checklist Point 4 directly.
    '''
    # ─── PREMIUM POOL ─────────────────────────────────────────
    active_workers = db.query(func.count(Worker.id)).filter(Worker.is_active == True).scalar() or 0
    total_premiums = db.query(func.sum(Policy.weekly_premium)).filter(Policy.is_active == True).scalar() or 0.0
    avg_premium = total_premiums / active_workers if active_workers > 0 else 0.0

    # ─── PAYOUT HISTORY ───────────────────────────────────────
    total_payouts = db.query(func.sum(Claim.payout_amount)).filter(
        Claim.status.in_(['APPROVED', 'PAID_ZERO_TOUCH'])
    ).scalar() or 0.0
    approved_count = db.query(func.count(Claim.id)).filter(
        Claim.status.in_(['APPROVED', 'PAID_ZERO_TOUCH'])
    ).scalar() or 0
    avg_payout = total_payouts / approved_count if approved_count > 0 else 325.0

    # ─── BCR CALCULATION ──────────────────────────────────────
    bcr = round(total_payouts / total_premiums, 4) if total_premiums > 0 else 0.0
    bcr_status = 'HEALTHY' if bcr <= 0.70 else ('WARNING' if bcr <= 0.90 else 'CRITICAL')

    # ─── 14-DAY MONSOON STRESS TEST ───────────────────────────
    peelamedu_workers = max(1, int(active_workers * 0.60))
    ukkadam_workers   = max(1, int(active_workers * 0.40))

    daily_payout_peelamedu = peelamedu_workers * avg_payout
    daily_payout_ukkadam   = ukkadam_workers   * avg_payout
    daily_max_payout       = daily_payout_peelamedu + daily_payout_ukkadam

    stress_14_day_total    = daily_max_payout * 14
    weekly_reserve_needed  = daily_max_payout * 7

    # ─── LIQUIDITY RESERVE ────────────────────────────────────
    weekly_premiums_collected = total_premiums  
    retained_fraction = 1.0 - min(bcr, 0.90)   
    liquidity_reserve = round(weekly_premiums_collected * retained_fraction * 4, 2)
    
    reserve_covers_days = round(liquidity_reserve / daily_max_payout, 1) if daily_max_payout > 0 else 99
    reserve_adequate = reserve_covers_days >= 14

    # ─── FRAUD SAVINGS ────────────────────────────────────────
    fraud_prevented = db.query(func.count(Claim.id)).filter(
        Claim.status == 'FLAGGED_FOR_LAV'
    ).scalar() or 0
    fraud_savings = round(fraud_prevented * avg_payout, 2)

    return {
        'bcr': {
            'value': bcr,
            'target': 0.65,
            'status': bcr_status,
            'interpretation': f'For every Rs.1 collected, Rs.{bcr:.2f} paid out. {round((1-bcr)*100,1)}% retained.'
        },
        'premium_pool': {
            'active_workers': active_workers,
            'weekly_collection_inr': round(total_premiums, 2),
            'total_payouts_inr': round(total_payouts, 2),
            'avg_payout_per_claim_inr': round(avg_payout, 2),
        },
        'stress_test': {
            'scenario': '14-day continuous monsoon trigger — worst case',
            'daily_max_payout_inr': round(daily_max_payout, 2),
            'total_14_day_exposure_inr': round(stress_14_day_total, 2),
            'weekly_reserve_needed_inr': round(weekly_reserve_needed, 2),
        },
        'liquidity_reserve': {
            'current_reserve_inr': liquidity_reserve,
            'covers_days_of_max_payout': reserve_covers_days,
            'is_adequate': reserve_adequate,
            'target_days': 14,
        },
        'fraud_impact': {
            'claims_prevented': fraud_prevented,
            'rupees_saved': fraud_savings,
        }
    }