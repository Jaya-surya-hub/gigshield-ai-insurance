import joblib
import pandas as pd
import os

# Load the trained model into memory when the server starts
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../premium_model.pkl')

try:
    pricing_model = joblib.load(MODEL_PATH)
except FileNotFoundError:
    print("Warning: premium_model.pkl not found. Run train_premium_model.py first.")
    pricing_model = None

def calculate_dynamic_premium(zone_ifi: float, past_floods: int, gigscore: int, is_monsoon: bool) -> float:
    """
    Called by the FastAPI router when a new worker registers to get their personalized quote.
    """
    if pricing_model is None:
        return 35.00 # Fallback flat rate if ML model fails to load
        
    # Format input for XGBoost
    input_data = pd.DataFrame([{
        'zone_ifi': zone_ifi,
        'historical_flood_count': past_floods,
        'worker_gigscore': gigscore,
        'current_season': 1 if is_monsoon else 0
    }])
    
    # Predict the premium
    predicted_premium = pricing_model.predict(input_data)[0]
    
    # Return rounded to 2 decimal places (currency format)
    return round(float(predicted_premium), 2)

# --- QUICK TEST ---
if __name__ == "__main__":
    # Test a high-risk scenario (Low-lying zone, monsoon season, new worker)
    quote = calculate_dynamic_premium(zone_ifi=1.4, past_floods=5, gigscore=50, is_monsoon=True)
    print(f"High-Risk Worker Premium: ₹{quote}/week")
    
    # Test a low-risk scenario (Elevated zone, dry season, trusted worker)
    quote_trusted = calculate_dynamic_premium(zone_ifi=0.8, past_floods=0, gigscore=95, is_monsoon=False)
    print(f"Trusted Worker Premium: ₹{quote_trusted}/week")