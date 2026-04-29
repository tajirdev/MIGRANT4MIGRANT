from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    bio = Column(String)
    is_active = Column(Boolean, default=True)