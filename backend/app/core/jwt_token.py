import os
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
import jwt
from backend.app.models import ModelUser
from app.schemas import jwtToken
from jwt.exceptions import InvalidTokenError
from sqlalchemy.orm import Session


load_dotenv()

SECRET_KEY  = os.getenv("SECRETKEY")
ALGORITHM = os.getenv("ALGOR")






ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str,credentials_exception,db:Session):
   try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = jwtToken.TokenData(email=email)
   except InvalidTokenError:
        raise credentials_exception
   user = db.query(user.User).filter(user.User.email == email).first()

   if user is None:
        raise credentials_exception

   return user 