from fastapi import APIRouter,Depends, status
from typing import Annotated
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import authentication
from fastapi.security import  OAuth2PasswordRequestForm
from app.schemas.schemaUser import ForgotPasswordRequest, ResetPasswordRequest

router = APIRouter(
   
    tags=['authetication']
)

@router.post('/login')
def login(request: Annotated[OAuth2PasswordRequestForm, Depends()],db:Session= Depends(get_db)):
    return authentication.login(request,db)



@router.post('/forgot-password', status_code=status.HTTP_200_OK)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return authentication.forgot_password(request, db)

@router.post('/reset-password', status_code=status.HTTP_200_OK)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    return authentication.reset_password(request, db)