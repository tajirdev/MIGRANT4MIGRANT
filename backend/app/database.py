import os
from dotenv import load_dotenv
from sqlalchemy import  create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL



load_dotenv()



SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:migrant_4_Migrant%40db.26@db:5432/migrantdb")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()