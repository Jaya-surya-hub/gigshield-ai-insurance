import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

def generate_fraud_training_data(num_samples=10000):
    """Generates synthetic claim behavior data to train the anomaly detector."""
    np.random.seed(42)
    
    # --- NORMAL BEHAVIOR (95% of data) ---
    normal_samples = int(num_samples * 0.95)
    normal_data = pd.DataFrame({
        'time_since_last_claim_days': np.random.normal(120, 30, normal_samples), # Claims are rare
        'claim_frequency_30d': np.random.poisson(0.1, normal_samples), # Usually 0 or 1 in a month
        'distance_from_declared_zone_km': np.random.exponential(1.5, normal_samples), # Usually within 1-3km
        'worker_gigscore': np.random.normal(75, 15, normal_samples) # Generally good scores
    })
    
    # --- FRAUDULENT BEHAVIOR / SPOOFERS (5% of data) ---
    # Spoofers often claim frequently, jump locations instantly, or have terrible GigScores
    fraud_samples = num_samples - normal_samples
    fraud_data = pd.DataFrame({
        'time_since_last_claim_days': np.random.uniform(1, 10, fraud_samples), # Claiming constantly
        'claim_frequency_30d': np.random.poisson(3, fraud_samples), # High frequency
        'distance_from_declared_zone_km': np.random.uniform(10, 50, fraud_samples), # GPS spoofing jumps
        'worker_gigscore': np.random.normal(30, 10, fraud_samples) # Low trust scores
    })
    
    # Combine and clean data (ensure no negative days/distances)
    df = pd.concat([normal_data, fraud_data], ignore_index=True)
    df = df.clip(lower=0)
    df['worker_gigscore'] = df['worker_gigscore'].clip(upper=100)
    
    return df

def train_isolation_forest():
    print("Generating synthetic claims data for Fraud Engine...")
    df = generate_fraud_training_data()
    
    # Isolation Forest expects a contamination rate (estimated % of fraud in the system)
    # We estimate 5% of claims might be highly anomalous
    print("Training Isolation Forest Anomaly Detector...")
    model = IsolationForest(n_estimators=100, contamination=0.05, random_state=42)
    
    # Fit the model
    model.fit(df)
    
    # Save the model
    joblib.dump(model, 'fraud_model.pkl')
    print("✅ Fraud model saved successfully as 'fraud_model.pkl'")

if __name__ == "__main__":
    train_isolation_forest()