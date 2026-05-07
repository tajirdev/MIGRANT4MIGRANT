from sqlalchemy import Column, Integer, String, Boolean, Text
from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    country = Column(String, index=True)
    email = Column(String)
    verified = Column(Boolean, default=False)
    description = Column(Text)
    services = Column(String)