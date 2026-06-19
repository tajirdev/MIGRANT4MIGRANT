from fastapi import APIRouter,Depends, status
from typing import Annotated
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import authentication
from fastapi.security import  OAuth2PasswordRequestForm
from app.schemas.schemaUser import ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest
# New imports
from app.services import authentication
from app.services import email as email_service 

router = APIRouter(
   
    tags=['authetication']
)

@router.post('/login')
def login(request: Annotated[OAuth2PasswordRequestForm, Depends()],db:Session= Depends(get_db)):
    return authentication.login(request,db)


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return email_service.forgot_password(request, db)

@router.post("/verify-otp", status_code=status.HTTP_200_OK)
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    return email_service.verify_otp(request, db)

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    return email_service.reset_password(request, db)