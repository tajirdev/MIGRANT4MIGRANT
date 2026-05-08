from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


# this is user table to be used
class migrant(Base):
    __tablename__ = "migrants"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    user_name = Column(String, unique=True)
    password_hash = Column(String)
    name = Column(String)
    role = Column(String, default="migrant")  # admin, migrant, volunteer (mentor)
    language = Column(String)
    current_country = Column(String)
    native_country = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
