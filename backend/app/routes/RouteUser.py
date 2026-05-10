from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import schemaUser
from app.services.Userservice import UserReg
from typing import List
from app.core.auth import get_current_user
from app.models import migrants
from app.core.authorization import RoleChecker



Userservice = UserReg()

router = APIRouter(
    tags=['register'],
    prefix="/auth"
    
)

mentor_and_admin = RoleChecker(["mentor", "admin"])

# routes for reg
@router.post('/register',response_model=schemaUser.showUser)
def register(request:schemaUser.migrant,db:Session=Depends(get_db)):
    return Userservice.registerUser(request,db)

#this route is for testing only

@router.get('/user',response_model=List[schemaUser.showUser])
def getuser(db:Session=Depends(get_db),current_user:schemaUser.migrant=Depends(mentor_and_admin)):
    return Userservice.getuser_all(db)
  



@router.get('/me',response_model=schemaUser.showUser)
def get_me(db:Session=Depends(get_db),current_user:schemaUser.migrant=Depends(get_current_user)):
    return Userservice.return_current_user(db,current_user_id=current_user.id)



