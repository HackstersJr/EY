from sqlalchemy.orm import Session
from models.database import SessionLocal
from models.schema import Vehicle, Telemetry, RCACAPARecord, User
import uuid
import random
from datetime import datetime, timedelta

def populate():
    db = SessionLocal()
    try:
        # Create User
        if db.query(User).count() == 0:
            user = User(full_name="Test User", email="test@test.com", role="CUSTOMER")
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            user = db.query(User).first()

        vehicles = []
        for i in range(10):
            v = Vehicle(
                user_id=user.id,
                model=random.choice(["Model X", "Model Y", "Truck Z"]),
                variant="Standard",
                year=random.choice([2020, 2021, 2022, 2023]),
                registration=f"REG-{i}-{uuid.uuid4().hex[:4]}",
                vin=str(uuid.uuid4()),
                mileage=random.randint(1000, 50000)
            )
            db.add(v)
            vehicles.append(v)
        db.commit()

        # Telemetry
        for v in vehicles:
            for _ in range(5):
                t = Telemetry(
                    vehicle_id=v.id,
                    speed=random.uniform(0, 120),
                    rpm=random.uniform(1000, 6000),
                    engine_temp=random.uniform(80, 120),
                    battery_level=random.uniform(10, 100),
                    brake_wear=random.uniform(0, 100),
                    tire_pressure_fl=32, tire_pressure_fr=32, tire_pressure_rl=32, tire_pressure_rr=32,
                    latitude=0, longitude=0
                )
                db.add(t)
        
        # Defects
        for v in vehicles[:5]:
            r = RCACAPARecord(
                vehicle_id=v.id,
                component=random.choice(["Brake Pad", "Battery", "Alternator"]),
                actual_finding="Worn out",
                root_cause="Usage",
                rca_confidence=0.9
            )
            db.add(r)
        
        db.commit()
        print("Data populated successfully!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    populate()
