from database import SessionLocal
from models import Worker, Policy

def seed_database():
    db = SessionLocal()
    
    # Check if we already have workers to avoid duplicates
    if db.query(Worker).count() > 0:
        print("Database is already seeded!")
        db.close()
        return

    print("🌱 Seeding database with mock gig workers...")

    # Worker 1: Ramesh in Peelamedu (High Infra, High Trust)
    worker_1 = Worker(
        phone_number="+919876543210",
        platform="Zomato",
        home_zone_id="COIMBATORE_PEELAMEDU",
        gig_score=90, # Very from database import SessionLocal
from models import Worker, Policy, Zone

def seed_database():
    db = SessionLocal()
    
    # Check if we already have workers to avoid duplicates
    if db.query(Worker).count() > 0:
        print("Database is already seeded!")
        db.close()
        return

    print("🌍 Seeding Zones...")
    z1 = Zone(id="COIMBATORE_PEELAMEDU", display_name="Peelamedu", description="Central Hub • High Elevation", latitude=11.0261, longitude=77.0028)
    z2 = Zone(id="COIMBATORE_UKKADAM", display_name="Ukkadam", description="Lake Adjacent • High Traffic", latitude=10.9905, longitude=76.9608)
    z3 = Zone(id="CHENNAI_ADYAR", display_name="Adyar, Chennai", description="Coastal • Dense Traffic", latitude=13.0033, longitude=80.2555)
    db.add_all([z1, z2, z3])
    db.commit()

    print("🌱 Seeding database with mock gig workers...")

    # Worker 1: Ramesh in Peelamedu (High Infra, High Trust)
    worker_1 = Worker(
        phone_number="+919876543210",
        platform="Zomato",
        home_zone_id="COIMBATORE_PEELAMEDU",
        gig_score=90, # Very trusted
        is_active=True
    )
    
    # Worker 2: Priya in Ukkadam (Low Infra, Mid Trust)
    worker_2 = Worker(
        phone_number="+919876543211",
        platform="Swiggy",
        home_zone_id="COIMBATORE_UKKADAM",
        gig_score=60, # Average trust
        is_active=True
    )
    
    # Worker 3: The "Spoofer" (Terrible Trust Score)
    worker_3 = Worker(
        phone_number="+919876543212",
        platform="Zomato",
        home_zone_id="COIMBATORE_PEELAMEDU",
        gig_score=25, # High risk for fraud
        is_active=True
    )

    db.add_all([worker_1, worker_2, worker_3])
    db.commit() # Commit workers to generate their IDs

    # Create active policies for these workers
    policy_1 = Policy(
        worker_id=worker_1.id,
        guidewire_policy_number="GIG-POL-001",
        plan_tier="Full",
        weekly_premium=32.50, # Discounted for high GigScore
        is_active=True
    )
    
    policy_2 = Policy(
        worker_id=worker_2.id,
        guidewire_policy_number="GIG-POL-002",
        plan_tier="Basic",
        weekly_premium=45.00, # Higher premium for low-lying zone
        is_active=True
    )

    policy_3 = Policy(
        worker_id=worker_3.id,
        guidewire_policy_number="GIG-POL-003",
        plan_tier="Full",
        weekly_premium=55.00, # High premium for low trust
        is_active=True
    )

    db.add_all([policy_1, policy_2, policy_3])
    db.commit()
    
    print("✅ Successfully injected 3 Workers and 3 Policies!")
    db.close()

if __name__ == "__main__":
    seed_database()trusted
        is_active=True
    )
    
    # Worker 2: Priya in Ukkadam (Low Infra, Mid Trust)
    worker_2 = Worker(
        phone_number="+919876543211",
        platform="Swiggy",
        home_zone_id="COIMBATORE_UKKADAM",
        gig_score=60, # Average trust
        is_active=True
    )
    
    # Worker 3: The "Spoofer" (Terrible Trust Score)
    worker_3 = Worker(
        phone_number="+919876543212",
        platform="Zomato",
        home_zone_id="COIMBATORE_PEELAMEDU",
        gig_score=25, # High risk for fraud
        is_active=True
    )

    db.add_all([worker_1, worker_2, worker_3])
    db.commit() # Commit workers to generate their IDs

    # Create active policies for these workers
    policy_1 = Policy(
        worker_id=worker_1.id,
        guidewire_policy_number="GIG-POL-001",
        plan_tier="Full",
        weekly_premium=32.50, # Discounted for high GigScore
        is_active=True
    )
    
    policy_2 = Policy(
        worker_id=worker_2.id,
        guidewire_policy_number="GIG-POL-002",
        plan_tier="Basic",
        weekly_premium=45.00, # Higher premium for low-lying zone
        is_active=True
    )

    policy_3 = Policy(
        worker_id=worker_3.id,
        guidewire_policy_number="GIG-POL-003",
        plan_tier="Full",
        weekly_premium=55.00, # High premium for low trust
        is_active=True
    )

    db.add_all([policy_1, policy_2, policy_3])
    db.commit()
    
    print("✅ Successfully injected 3 Workers and 3 Policies!")
    db.close()

if __name__ == "__main__":
    seed_database()
