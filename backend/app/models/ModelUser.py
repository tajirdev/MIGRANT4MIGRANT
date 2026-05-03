from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base


# this is user table to be used
class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    user_name = Column(String, unique=True)
    email = Column(String, unique=True)
    password_hash = Column(String)
    role = Column(String, default="user")  # admin, migrant, volunteer (mentor)
    language = Column(String)
    country = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
