from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os
import datetime
import services.alert_service as alert_svc
import math 
import services.weather_api as weather
import services.guidewire_api as guidewire
import services.ifi_calculator as ifi
import services.fraud_engine as fraud
import services.premium_engine as premium_engine 
import services.aqi_service as aqi_svc
from fpdf import FPDF
from database import get_db
from models import Worker, Policy
from models import Worker, Policy, Claim, Zone

router = APIRouter()

class TelematicsPayload(BaseModel):
    zone_id: str
    live_lat: float | None = None
    live_lon: float | None = None
    is_moving: bool = False
    kinematic_variance: float = 0.0

def calculate_distance(lat1, lon1, lat2, lon2):
    if not lat1 or not lon1: return 0.0
    R = 6371.0 # km
    dLat = (lat2 - lat1) * math.pi / 180.0
    dLon = (lon2 - lon1) * math.pi / 180.0
    a = math.sin(dLat/2.0)**2 + math.cos(lat1 * math.pi / 180.0) * math.cos(lat2 * math.pi / 180.0) * math.sin(dLon/2.0)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

@router.get('/get-quote')
def get_quote(zone_id: str, db: Session = Depends(get_db)):
    lockout = alert_svc.is_enrollment_locked(zone_id, db)
    if lockout['locked']:
        return {
            'enrollment_locked': True,
            'lock_reason': lockout['reason'],
            'hours_remaining': lockout['hours_remaining'],
            'message': lockout['message'],
            'premium': None,
            'threshold_mm': None,
        }

    zone_ifi = ifi.get_zone_ifi(zone_id, db)
    ifi_reasoning = ifi.get_zone_reasoning(zone_id, db)
    threshold_mm = round(50.0 * (1 / zone_ifi), 1)
    
    zone_entity = db.query(Zone).filter(Zone.id == zone_id).first()
    is_monsoon = False
    if zone_entity:
        is_monsoon = weather.is_monsoon_season(zone_entity.latitude, zone_entity.longitude)
    
    premium = premium_engine.calculate_dynamic_premium(
        zone_ifi=zone_ifi, past_floods=3, gigscore=70, is_monsoon=is_monsoon
    )
    return {
        'enrollment_locked': False,
        'premium': premium,
        'zone_id': zone_id,
        'ifi_score': zone_ifi,
        'threshold_mm': threshold_mm,
        'agent_reasoning': ifi_reasoning,
        'is_monsoon_adjustment': is_monsoon
    }

@router.post("/evaluate-zone")
async def evaluate_zone_triggers(payload: TelematicsPayload, db: Session = Depends(get_db)):
    zone_entity = db.query(Zone).filter(Zone.id == payload.zone_id).first()
    if not zone_entity:
        raise HTTPException(status_code=404, detail="Zone not found in geographical database")
        
    zone_center_lat = zone_entity.latitude
    zone_center_lon = zone_entity.longitude

    current_weather = weather.get_current_conditions(zone_center_lat, zone_center_lon)
    rainfall_mm = current_weather.get("rainfall_24h", 0)
    aqi_value = aqi_svc.get_aqi(zone_center_lat, zone_center_lon)
    
    zone_ifi = ifi.get_zone_ifi(payload.zone_id, db) 
    adjusted_threshold = 50.0 * (1 / zone_ifi) 
    
    is_safe = True
    trigger_type = None
    
    if rainfall_mm >= adjusted_threshold:
        is_safe = False
        trigger_type = "HEAVY_RAIN"
    elif aqi_value > 300:
        is_safe = False
        trigger_type = "AQI_SPIKE"
        
    if is_safe:
        return {"status": "safe", "message": f"Rainfall ({rainfall_mm}mm) and AQI ({aqi_value}) below thresholds."}
    
    is_demo = os.getenv("DEMO_MODE", "false").lower() == "true"
    
    now = datetime.datetime.utcnow()
    
    if is_demo:
        active_policies = db.query(Policy).join(Worker).filter(
            ((Worker.home_zone_id == payload.zone_id) | (Worker.id == 1)), 
            Policy.is_active == True,
            (Policy.paused_until == None) | (Policy.paused_until < now)
        ).all()
    else:
        active_policies = db.query(Policy).join(Worker).filter(
            Worker.home_zone_id == payload.zone_id, 
            Policy.is_active == True,
            (Policy.paused_until == None) | (Policy.paused_until < now)
        ).all()
    
    triggered_claims = []
    flagged_claims = []
    
    for policy in active_policies:
        worker = policy.worker
        
        distance_km = calculate_distance(payload.live_lat, payload.live_lon, zone_center_lat, zone_center_lon)
        
        demo_variance = 0.0 if worker.id == 3 else payload.kinematic_variance
            
        fraud_evaluation = fraud.check_claim_anomaly(
            days_since_last_claim=120 if worker.id != 3 else 2,
            frequency_30d=0 if worker.id != 3 else 4,         
            distance_km=distance_km,                     
            gigscore=worker.gig_score,
            kinematic_variance=demo_variance 
        )

        if fraud_evaluation["is_anomaly"] or fraud_evaluation["risk_score"] > 0.8:
            flagged_claims.append({
                "worker_id": worker.id, "status": "FLAGGED_FOR_LAV", "reason": "Hardware Telematics Anomaly."
            })
            continue 
            
        gw_response = guidewire.initiate_zero_touch_claim(
            policy_number=policy.guidewire_policy_number,
            trigger_type=trigger_type, payout=policy.weekly_premium * 10, zone=payload.zone_id
        )
        
        new_claim = Claim(
            worker_id=worker.id,
            trigger_type=trigger_type,
            payout_amount=policy.weekly_premium * 10,
            status="PAID_ZERO_TOUCH"
        )
        db.add(new_claim)
        
        triggered_claims.append({"worker_id": worker.id, "gw_response": gw_response})
        
    db.commit()
    return {
        "status": "disruption_processed", "claims_initiated": len(triggered_claims),
        "claims_flagged_for_fraud": len(flagged_claims), "details": triggered_claims, "flagged": flagged_claims
    }
@router.get("/claims/{worker_id}")
def get_claim_history(worker_id: int, db: Session = Depends(get_db)):
    """Fetches the payout history for a specific worker."""
    claims = db.query(Claim).filter(Claim.worker_id == worker_id).order_by(Claim.created_at.desc()).all()
    
    return [
        {
            "id": claim.id,
            "trigger_type": claim.trigger_type,
            "payout_amount": claim.payout_amount,
            "status": claim.status,
            "created_at": claim.created_at
        }
        for claim in claims
    ]

@router.get("/claims/{claim_id}/receipt")
def get_claim_receipt(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(200, 10, txt="GigShield Claim Receipt", ln=True, align='C')
    pdf.ln(10)
    
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Claim ID: CLM-{claim.id:04}", ln=True)
    pdf.cell(200, 10, txt=f"Date: {claim.created_at.strftime('%Y-%m-%d %H:%M:%S')}", ln=True)
    pdf.ln(5)
    
    pdf.cell(200, 10, txt=f"Trigger Type: {claim.trigger_type}", ln=True)
    pdf.cell(200, 10, txt=f"Payout Amount: Rs. {claim.payout_amount:,.2f}", ln=True)
    pdf.cell(200, 10, txt=f"Status: {claim.status}", ln=True)
    
    pdf.ln(20)
    pdf.set_font("Arial", 'I', 10)
    pdf.cell(200, 10, txt="This is an automated receipt from the GigShield Parametric Insurance Platform.", ln=True, align='C')
    
    response_content = pdf.output(dest='S').encode('latin-1')
    return Response(content=response_content, media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=claim_{claim.id}.pdf"})

@router.get("/workers/{worker_id}/gigscore")
def get_worker_gigscore(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(Worker).filter(Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return {"gigscore": worker.gig_score}

@router.patch("/policies/{policy_id}/pause")
def pause_policy(policy_id: int, db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    # Pause for 7 days
    policy.paused_until = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    db.commit()
    return {"status": "paused", "paused_until": policy.paused_until}

@router.get("/policies/worker/{worker_id}")
def get_worker_policy(worker_id: int, db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.worker_id == worker_id, Policy.is_active == True).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Active policy not found")
    return {
        "id": policy.id,
        "guidewire_policy_number": policy.guidewire_policy_number,
        "plan_tier": policy.plan_tier,
        "weekly_premium": policy.weekly_premium,
        "paused_until": policy.paused_until
    }

class RegisterWorkerPayload(BaseModel):
    phone_number: str
    home_zone_id: str

@router.post("/register-worker")
def register_worker(payload: RegisterWorkerPayload, db: Session = Depends(get_db)):
    """Creates a new worker + policy in the DB after onboarding. Returns the real worker_id."""
    # Prevent duplicate registrations by phone
    existing = db.query(Worker).filter(Worker.phone_number == payload.phone_number).first()
    if existing:
        policy = db.query(Policy).filter(Policy.worker_id == existing.id, Policy.is_active == True).first()
        return {"worker_id": existing.id, "policy_id": policy.id if policy else None, "status": "existing"}

    new_worker = Worker(
        phone_number=payload.phone_number,
        platform="GigShield",
        home_zone_id=payload.home_zone_id,
        gig_score=70,
        is_active=True
    )
    db.add(new_worker)
    db.commit()
    db.refresh(new_worker)

    # Get zone IFI to compute real premium
    zone_ifi = ifi.get_zone_ifi(payload.home_zone_id, db)
    premium = premium_engine.calculate_dynamic_premium(zone_ifi=zone_ifi, past_floods=3, gigscore=70, is_monsoon=False)

    import uuid
    policy_number = f"GIG-POL-{uuid.uuid4().hex[:8].upper()}"
    new_policy = Policy(
        worker_id=new_worker.id,
        guidewire_policy_number=policy_number,
        plan_tier="Full",
        weekly_premium=premium,
        is_active=True
    )
    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)

    return {"worker_id": new_worker.id, "policy_id": new_policy.id, "status": "created"}

@router.post('/admin/create-alert')
def create_weather_alert(zone_id: str, db: Session = Depends(get_db)):
    alert = alert_svc.create_demo_alert(zone_id, db)
    return { 'status': 'created', 'zone_id': zone_id, 'alert_id': alert.id }

@router.post('/admin/clear-alerts')
def clear_weather_alerts(zone_id: str, db: Session = Depends(get_db)):
    alert_svc.clear_alerts(zone_id, db)
    return { 'status': 'cleared', 'zone_id': zone_id }
