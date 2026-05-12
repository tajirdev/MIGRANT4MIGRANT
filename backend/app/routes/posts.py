from fastapi import APIRouter, HTTPException, status, Depends
from app.services.posts_service import get_all_posts
from typing import Optional, List
from sqlalchemy.orm import Session
from app.core.database import get_db


router = APIRouter()

@router.get("/posts")
def read_post(category: str = None, db: Session = Depends(get_db)):
    posts = get_all_posts(db, category=category)

    if not posts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    return {"data": posts}
