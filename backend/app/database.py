import os
from dotenv import load_dotenv
from sqlalchemy import  create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


# loading .inv
load_dotenv()


# This matches the credentials your lead provided
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password123@db:5432/migrantdb"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()