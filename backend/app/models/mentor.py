from sqlalchemy import Column, DateTime, Integer, String, Float,ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base
from sqlalchemy.orm import relationship
class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("migrants.id"))
    expertise = Column(String)
    languages = Column(String)
    organization = Column(String)
    availability = Column(String)
    rating = Column(Float, default=0.0)

    migrant = relationship('Migrant' ,back_populates='mentor')
   