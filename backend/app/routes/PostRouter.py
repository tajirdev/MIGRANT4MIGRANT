from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import schemasResources  
from app.services.ResourcesServices import ResourceService
from app.core.authorization import RoleChecker
from app.schemas import schemaUser

ResourceService = ResourceService()
mentor_and_admin = RoleChecker(["mentor", "admin"])

router = APIRouter(
    tags=['RESOURCES'],
)

@router.delete("/delete-post/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db),current_user:schemaUser.migrant=Depends(mentor_and_admin)):
    
    return ResourceService.delete_post(db, post_id)