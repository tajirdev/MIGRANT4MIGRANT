from sqlalchemy import Column, DateTime, Integer, String, Float
from sqlalchemy.sql import func
from app.core.database import Base

class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    user_name = Column(String, unique=True)
    password_hash = Column(String)
    current_country = Column(String)
    native_country = Column(String)
    role = Column(String, default="mentor")  # admin, migrant, volunteer (mentor)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expertise = Column(String)
    languages = Column(String)
    availability = Column(String)
    rating = Column(Float, default=0.0)