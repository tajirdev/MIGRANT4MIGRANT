from fastapi import Depends,HTTPException,status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import schemaUser
from app.models import ModelUser

# all services should be here for user
class UserReg:
  
   def registerUser(self,request:schemaUser.User,db:Session):
    new_user = ModelUser.User(
        name = request.name,
        user_name = request.user_name,
        email = request.email,
        password_hash = request.password_hash,
        language = request.language,
        country = request.country
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback() 
        raise HTTPException(status_code=400, detail="Conflict: Data already exists.")  
    
    return new_user

   def getuser_all(self,db:Session):
        user = db.query(ModelUser.User).all()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return user
