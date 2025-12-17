from models.database import engine, Base
from models.schema import User, Vehicle, CleanedVehicleData, PredictedIssue, Complaint, Appointment, ServiceRecord, RCACAPARecord, UEBALog, ChatSession, ManufacturingInsight

def init_db():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully.")

if __name__ == "__main__":
    init_db()
