import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
import joblib

def generate_synthetic_data(num_samples=5000):
    """Generates mock data for gig workers to train the pricing model."""
    np.random.seed(42)
    
    # 1. Infrastructure Fragility Index (0.7 Resilient to 1.5 Fragile)
    zone_ifi = np.random.uniform(0.7, 1.5, num_samples)
    
    # 2. Historical Flood Count (0 to 8 times a year)
    historical_flood_count = np.random.randint(0, 9, num_samples)
    
    # 3. Worker GigScore (0 to 100)
    worker_gigscore = np.random.randint(20, 100, num_samples)
    
    # 4. Season (1 = Monsoon/High Risk, 0 = Dry/Low Risk)
    current_season = np.random.choice([0, 1], num_samples, p=[0.7, 0.3])
    
    # Calculate Target: Base Premium is ₹35.
    # High IFI, High Floods, and Monsoon INCREASE premium.
    # High GigScore DECREASES premium (Loyalty discount).
    
    base_premium = 35.0
    risk_markup = (zone_ifi * 5) + (historical_flood_count * 1.5) + (current_season * 8)
    trust_discount = (worker_gigscore / 100) * 12
    
    adjusted_premium = base_premium + risk_markup - trust_discount
    
    # Add some random noise for realism
    adjusted_premium += np.random.normal(0, 2, num_samples)
    
    # Clip to ensure premiums stay within a reasonable weekly bound (₹20 to ₹65)
    adjusted_premium = np.clip(adjusted_premium, 20.0, 65.0)
    
    df = pd.DataFrame({
        'zone_ifi': zone_ifi,
        'historical_flood_count': historical_flood_count,
        'worker_gigscore': worker_gigscore,
        'current_season': current_season,
        'weekly_premium_inr': adjusted_premium
    })
    
    return df

def train_and_save_model():
    print("Generating synthetic gig worker data...")
    df = generate_synthetic_data()
    
    X = df[['zone_ifi', 'historical_flood_count', 'worker_gigscore', 'current_season']]
    y = df['weekly_premium_inr']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training XGBoost Regressor...")
    model = xgb.XGBRegressor(
        objective='reg:squarederror', 
        n_estimators=100, 
        learning_rate=0.1, 
        max_depth=4
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    print(f"Model Performance - MSE: {mse:.2f}, R2 Score: {r2:.2f}")
    
    # Save the model for the FastAPI backend
    joblib.dump(model, 'premium_model.pkl')
    print("✅ Model saved successfully as 'premium_model.pkl'")

if __name__ == "__main__":
    train_and_save_model()