from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Users.id"))
    
    expertise = Column(String)
    languages = Column(String)
    availability = Column(String)
    rating = Column(Float, default=0.0)

    user = relationship("User")