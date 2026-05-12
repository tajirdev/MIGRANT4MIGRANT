from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session  
from app.database import get_db
import models
from hashing import Hash
import jwtoken
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

def login(request: Annotated[OAuth2PasswordRequestForm, Depends(get_db)], database: Session = Depends(get_db)):
    user = database.query(models.User).filter(models.User.username == request.username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid Credentials")
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incorrect password")
    access_token = jwtoken.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}