from fastapi import HTTPException,status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.schemas import schemaUser
from app.models import migrants
from app.core import security

# all services should be here for user
class UserReg:
  
   def registerUser(self,request:schemaUser.migrant,db:Session):
    new_user =migrants.Migrant(
        name = request.name,
        user_name = request.user_name,
        email = request.email,
        password_hash = security.Hash.hash(request.password_hash),
        language = request.language,
        current_country = request.current_country,
        native_country = request.native_country
    )
    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback() 
        raise HTTPException(status_code=400, detail="Conflict: Data already exists.")  
    
    return new_user
   

     #this for testing only
    
   def getuser_all(self,db:Session):
        user = db.query(migrants.Migrant).all()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return user
   

   def return_current_user(self,db:Session,current_user_id:int):
        active_user = db.query(migrants.Migrant).filter(migrants.Migrant.id == current_user_id).first()
        return active_user
   



   
   

   
