from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import schemaUser
from app.services.Userservice import UserReg
from typing import List

Userservice = UserReg()

router = APIRouter(
    tags=['register'],
    prefix="/auth"
    
)


# routes for reg
@router.post('/register',response_model=schemaUser.showUser)
def register(request:schemaUser.User,db:Session=Depends(get_db)):
    return Userservice.registerUser(request,db)



@router.get('/user',response_model=List[schemaUser.showUser])
def getuser(db:Session=Depends(get_db)):
    return Userservice.getuser_all(db)