from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid
from .database import Base

# Enums
# Note: In a real app, we might want to define these explicitly as Python Enums
# But for simplicity with SQLAlchemy, we can use strings in the Enum column definition

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4())) # Using String for UUID compatibility with SQLite/Postgres
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    full_name = Column(String)
    role = Column(String) # 'CUSTOMER', 'OEM', 'MANUFACTURER'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    
    vehicles = relationship("Vehicle", back_populates="owner")

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    model = Column(String)
    variant = Column(String)
    year = Column(Integer)
    registration = Column(String, unique=True)
    vin = Column(String, unique=True, index=True)
    mileage = Column(Integer)
    last_service_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="vehicles")
    cleaned_data = relationship("CleanedVehicleData", back_populates="vehicle")
    predicted_issues = relationship("PredictedIssue", back_populates="vehicle")
    complaints = relationship("Complaint", back_populates="vehicle")
    appointments = relationship("Appointment", back_populates="vehicle")
    service_records = relationship("ServiceRecord", back_populates="vehicle")
    chat_sessions = relationship("ChatSession", back_populates="vehicle")

class CleanedVehicleData(Base):
    __tablename__ = "cleaned_vehicle_data"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    user_id = Column(String, ForeignKey("users.id"))
    data_type = Column(String) # 'complaint', 'telematics', 'service'
    normalized_data = Column(JSONB) # Requires Postgres, will fallback to Text in SQLite if needed but we are using Postgres
    confidence = Column(Float)
    source = Column(String)
    status = Column(String) # 'validated', 'flagged'
    created_at = Column(DateTime, default=datetime.utcnow)
    
    vehicle = relationship("Vehicle", back_populates="cleaned_data")

class PredictedIssue(Base):
    __tablename__ = "predicted_issues"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    component = Column(String)
    failure_probability = Column(Float)
    severity = Column(String) # 'LOW', 'MEDIUM', 'HIGH'
    time_horizon = Column(String)
    confidence = Column(Float)
    reason = Column(Text)
    overall_health = Column(String) # 'GREEN', 'AMBER', 'RED'
    recommended_service_window = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    vehicle = relationship("Vehicle", back_populates="predicted_issues")

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    user_id = Column(String, ForeignKey("users.id"))
    affected_part = Column(String)
    symptom_category = Column(String)
    description = Column(Text)
    when_occurs = Column(String)
    severity_estimate = Column(String) # 'LOW', 'MEDIUM', 'HIGH'
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    vehicle = relationship("Vehicle", back_populates="complaints")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    user_id = Column(String, ForeignKey("users.id"))
    service_center_id = Column(String)
    appointment_date = Column(DateTime) # Combined date/time or just date
    appointment_time = Column(String) # If separate
    issue_id = Column(String, ForeignKey("predicted_issues.id"), nullable=True)
    status = Column(String) # 'CONFIRMED', 'COMPLETED', 'CANCELLED'
    confirmation_code = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    vehicle = relationship("Vehicle", back_populates="appointments")
    service_record = relationship("ServiceRecord", uselist=False, back_populates="appointment")

class ServiceRecord(Base):
    __tablename__ = "service_records"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    appointment_id = Column(String, ForeignKey("appointments.id"))
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    actual_issues_found = Column(Text)
    parts_replaced = Column(JSONB)
    time_taken_hours = Column(Float)
    technician_notes = Column(Text)
    customer_satisfaction = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    vehicle = relationship("Vehicle", back_populates="service_records")
    appointment = relationship("Appointment", back_populates="service_record")
    rca_capa = relationship("RCACAPARecord", uselist=False, back_populates="service_record")

class RCACAPARecord(Base):
    __tablename__ = "rca_capa_records"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    service_record_id = Column(String, ForeignKey("service_records.id"))
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    component = Column(String)
    actual_finding = Column(Text)
    root_cause = Column(Text)
    rca_confidence = Column(Float)
    capa_items = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    service_record = relationship("ServiceRecord", back_populates="rca_capa")

class UEBALog(Base):
    __tablename__ = "ueba_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    timestamp = Column(DateTime, default=datetime.utcnow)
    agent_name = Column(String)
    action = Column(String)
    resource = Column(String)
    parameters = Column(JSONB)
    result = Column(String) # 'ALLOWED', 'BLOCKED'
    reason = Column(Text)
    risk_level = Column(String) # 'LOW', 'MEDIUM', 'HIGH'
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    vehicle_id = Column(String, ForeignKey("vehicles.id"), nullable=True)
    role = Column(String) # 'customer', 'oem', 'manufacturer'
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    messages = Column(JSONB)
    
    vehicle = relationship("Vehicle", back_populates="chat_sessions")

class ManufacturingInsight(Base):
    __tablename__ = "manufacturing_insights"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    insight_data = Column(JSONB)
    created_at = Column(DateTime, default=datetime.utcnow)

class Telemetry(Base):
    __tablename__ = "telemetry"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    vehicle_id = Column(String, ForeignKey("vehicles.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)
    speed = Column(Float)
    rpm = Column(Float)
    engine_temp = Column(Float)
    battery_level = Column(Float)
    brake_wear = Column(Float)
    tire_pressure_fl = Column(Float)
    tire_pressure_fr = Column(Float)
    tire_pressure_rl = Column(Float)
    tire_pressure_rr = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
