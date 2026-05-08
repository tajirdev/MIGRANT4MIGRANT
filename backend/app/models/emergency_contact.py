from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class EmergencyContact(Base):
    __tablename__ = "emergency_contacts"

    id = Column(Integer, primary_key=True, index=True)
    country = Column(String, index=True)
    service_name = Column(String)
    phone = Column(String)
    available_24h = Column(Boolean, default=True)
    date=Column(String)