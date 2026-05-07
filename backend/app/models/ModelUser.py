from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


# this is user table to be used
class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    user_name = Column(String, unique=True)
    password_hash = Column(String)
    name = Column(String)
    role = Column(String, default="user")  # admin, migrant, volunteer (mentor)
    language = Column(String)
    country = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
