import os
from typing import Optional
from dotenv import load_dotenv
from sqlalchemy import  create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL



load_dotenv()



SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def fetch_posts(category: Optional[str] = None):
    from app.models import Post

    db = SessionLocal()
    try:
        query = db.query(Post)
        if category:
            query = query.filter(Post.category == category)
        return query.all()
    finally:
        db.close()