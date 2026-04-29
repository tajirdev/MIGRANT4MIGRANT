from app.database import Base
from sqlalchemy import Column,String,Integer

class Taste(Base):

    __tablename__ = "taste_table"
    id = Column(Integer,primary_key=True)