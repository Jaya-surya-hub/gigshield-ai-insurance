import joblib
import os
import pandas as pd

# 1. Load the trained IsolationForest model into memory when the server starts
_MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'fraud_model.pkl')
try:
    _fraud_model = joblib.load(_MODEL_PATH)
    print("✅ IsolationForest Fraud Model loaded successfully.")
except FileNotFoundError:
    print("⚠️ Warning: fraud_model.pkl not found. Falling back to rule-based engine.")
    _fraud_model = None


def check_claim_anomaly(days_since_last_claim: int, frequency_30d: int, distance_km: float, gigscore: int, kinematic_variance: float):
    risk_score = 0.0
    reasons = []

    # --- PART A: THE HARDWARE & SENSOR RULES ---
    
    # The Spoofer Trap (Variance < 0.2 usually means a laptop emulator)
    if kinematic_variance < 0.2:
        risk_score += 0.5
        reasons.append(f"Hardware anomaly: Unnaturally low motion variance ({kinematic_variance}). Possible emulator.")

    if distance_km > 2.0:
        risk_score += 0.3
        reasons.append(f"Worker is {distance_km:.1f}km outside the active weather zone.")

    if frequency_30d >= 3 or days_since_last_claim < 7:
        risk_score += 0.3
        reasons.append("High claim frequency detected in the last 30 days.")


    # --- PART B: THE ISOLATION FOREST ML CHECK ---
    
    # We must construct a DataFrame with the EXACT column names used during training
    if _fraud_model is not None:
        features = pd.DataFrame([{
            'time_since_last_claim_days': days_since_last_claim,
            'claim_frequency_30d': frequency_30d,
            'distance_from_declared_zone_km': distance_km,
            'worker_gigscore': gigscore
        }])
        
        # Predict: 1 = Normal, -1 = Anomaly
        prediction = _fraud_model.predict(features)[0] 
        
        if prediction == -1:
            risk_score += 0.4
            reasons.append('IsolationForest ML: Multi-variable statistical anomaly detected.')


    # --- PART C: GIGSCORE MITIGATION ---
    
    # AI gives the benefit of the doubt to trusted, veteran workers
    if gigscore > 85:
        risk_score -= 0.2  

    final_risk = max(0.0, min(1.0, risk_score))

    return {
        "is_anomaly": final_risk >= 0.7,
        "risk_score": round(final_risk, 2),
        "flags": reasons
    }