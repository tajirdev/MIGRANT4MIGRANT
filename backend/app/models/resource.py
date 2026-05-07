from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    description = Column(Text)
    location = Column(String)
    contact = Column(String)
    verified = Column(Boolean, default=False)
    
    # Links to the mentor table
    added_by = Column(Integer, ForeignKey("mentors.id"))
    mentor = relationship("Mentor")