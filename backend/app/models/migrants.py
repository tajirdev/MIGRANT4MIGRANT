from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base
from sqlalchemy.orm import relationship

# this is user table to be used
class Migrant(Base):
    __tablename__ = "migrants"

    id = Column(Integer, primary_key=True)
    email = Column(String,unique=True,index=True, nullable=False)
    user_name = Column(String, unique=True)
    password_hash = Column(String)
    name = Column(String)
    role = Column(String, default="migrant")  # admin, migrant, mentor
    language = Column(String)
    current_country = Column(String)
    native_country = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    mentor = relationship('Mentor' ,back_populates='migrant',cascade="all, delete")
    post = relationship("Post", back_populates="author",cascade="all, delete")
    
