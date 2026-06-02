from fastapi import HTTPException,status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.schemas import schemaUser
from app.models import migrants
from app.core import security
import re
from datetime import datetime, timedelta
import secrets

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
   
   def edit_me(self,request:schemaUser.Edite,db:Session,current_user_id:int):
        active_user = db.query(migrants.Migrant).filter(migrants.Migrant.id == current_user_id).first()


        active_user.name = request.name
        active_user.user_name = request.user_name
        
        active_user.language = request.language
        active_user.current_country = request.current_country
        active_user.native_country = request.native_country
    
        try:
            db.add(active_user)
            db.commit()
            db.refresh(active_user)
        except IntegrityError:
            db.rollback() 
            raise HTTPException(status_code=400, detail="Conflict: Data already exists.")  
        
        return {"message":"you have update your information"}
   
   def delete_user(self, db: Session, current_user_id: int):
        active_user = db.query(migrants.Migrant).filter(migrants.Migrant.id ==current_user_id).delete(synchronize_session=False)

        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return {"your no longer member"}
   
    #This is for password validation

   def validate_password(password: str):
       if len(password) < 8:
           raise HTTPException(status_code=400, detail= "Password must be at least 8 characters long")
       
       if not re.search(r"[A-Z]", password):
           raise HTTPException(status_code=400, detail="Password must contain an uppercase letter")
       
       if not re.search("r[a-z]",password):
           raise HTTPException(status_code=400, detail="Password must contain a lowercase letter")
       
       if not re.search("r\d", password):
           raise HTTPException(status_code=400, detail="Password must contain a number")
       

   def forgot_password(self, email: str, db:Session,current_user_id:int):
       
      user =db.querry
      (migrants.Migrant).filter(migrants.Migrant.email == email).first()

      if user:
          token = secrets.token_urlsafe(32)
          expiry = datetime.utcnow() + timedelta(hours=1)
          user.reset_token = token
          user.reset_token_expiry = expiry
          user.reset_token_used = False



          db.commit()

          reset_link = (
            f"https://frontend-domain.com/"
            f"reset-password?token={token}"
        )

          send_reset_email(
            user.email,
            reset_link
        )

     # Always return same message
          return {
        "message":
        "If the email exists, a password reset link has been sent."
      }


     #Reset Link
      def send_reset_email(
         email: str,
         reset_link: str
       ):

       body = f"""
      Hello,

     We received a request to reset your password.

     Click the link below to create a new password:

     {reset_link}

     If you did not request this change, please ignore this email.

     Thank you,
     Migrant4Migrant Team
     """

          

   def reset_password(
    self,
    token: str,
    new_password: str,
    db: Session
     ):

       validate_password(
        new_password
     )

       user = db.query( 
        migrants.Migrant
    ).filter(
        migrants.Migrant.reset_token == token
    ).first()
       
       if not user:

        raise HTTPException(
            status_code=400,
            detail="Invalid reset token"
        )

       if user.reset_token_used:

        raise HTTPException(
            status_code=400,
            detail="Invalid reset token"
        )

       if datetime.utcnow() > user.reset_token_expiry:

        raise HTTPException(
            status_code=400,
            detail="Reset token has expired"
        )

       user.password_hash = security.Hash.hash(
        new_password
    )

    # invalidate token immediately

       user.reset_token = None
       user.reset_token_expiry = None
       user.reset_token_used = True

       db.commit()
 
       return {
        "message":
        "Password reset successful. You can now log in with your new password."
    }

       
       
       
           

       


       
   



   
   

   
