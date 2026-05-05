from fastapi import APIRouter,Depends
from typing import Annotated
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import authentication
from fastapi.security import  OAuth2PasswordRequestForm
router = APIRouter(
   
    tags=['authetication']
)

@router.post('/login')
def login(request: Annotated[OAuth2PasswordRequestForm, Depends()],db:Session= Depends(get_db)):
    return authentication.login(request,db)