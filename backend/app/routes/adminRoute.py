from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import admin,schemaUser
from app.services.admin import Admin
from app.models import migrants


router = APIRouter(
    prefix="/admin",
    tags=['ADMIN']
)
Admin_service = Admin()





# admin route
@router.post("/register")
def crate_admin(request:admin.Admin,db:Session=Depends(get_db)):
    return Admin_service.crate_new_admin(request,db)