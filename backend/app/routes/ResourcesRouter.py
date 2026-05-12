from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import schemasResources  
from app.services.ResourcesServices import ResourceService

ResourceService = ResourceService()

router = APIRouter(
    tags=['RESOURCES'],
)

@router.delete("/delete-post/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    
    return ResourceService.delete_post(db, post_id)