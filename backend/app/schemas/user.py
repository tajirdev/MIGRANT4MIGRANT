from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

from pydantic import BaseModel, EmailStr


# Role Constants

class UserRole:
    GUEST = "guest"
    MIGRANT = "migrant"
    VOLUNTEER = "volunteer"
    ADMIN = "admin"


# Data Basemodel

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, nullable=False, index=True)
    user_name = Column(String(100), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    name = Column(String(255), nullable=True)

    role = Column(String(20), default=UserRole.GUEST)

    language = Column(String(10), nullable=True)
    country = Column(String(100), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())



# Pydantic Schemas

class UserCreate(BaseModel):
    email: EmailStr
    user_name: str
    password: str
    name: str | None = None
    role: str = UserRole.GUEST


class UserOut(BaseModel):
    id: int
    email: EmailStr
    user_name: str
    name: str | None
    role: str
    language: str | None
    country: str | None
    created_at: str

    class Config:
        from_attributes = True
