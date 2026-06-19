from fastapi import HTTPException,status
from sqlalchemy.orm import Session
from app.schemas import SchemaMentor
from sqlalchemy.orm import Session
from app.models import mentor,migrants
from sqlalchemy.exc import IntegrityError




class Mentor:

    def register_mentor(self,request:SchemaMentor.Mentor,db:Session,current_user_id : int):
        existing_mentor = db.query(mentor.Mentor).filter(mentor.Mentor.user_id == current_user_id).first()
        existing_role = db.query(migrants.Migrant).filter(migrants.Migrant.id==current_user_id).first()

        if existing_mentor:
            raise HTTPException(status_code=400,detail='your already mentor')

        new_mentor = mentor.Mentor(
            user_id = current_user_id,
            expertise = request.expertise,
            languages = request.languages,
            organization = request.organization,
            availability = request.availability,
           # role = "mentor"
        )
        
        db.add(new_mentor)
        db.commit()
        db.refresh(new_mentor)

        existing_role.role = "mentor"

        db.commit()

        return {'message':"you have been updated to mentor"}
    

    def get_mentor_info(self,db:Session,current_user_id:int):
        show_mentor = db.query(mentor.Mentor).filter(mentor.Mentor.user_id== current_user_id).first()

        if not show_mentor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="mentor not found"

            )
        
        return show_mentor
    
    def edit_me(self,request:SchemaMentor.Mentor,db:Session,current_user_id:int):
        active_user = db.query(mentor.Mentor).filter(mentor.Mentor.user_id== current_user_id).first()


        active_user.user_id = current_user_id
        active_user.expertise = request.expertise
        active_user.languages = request.languages
        active_user.organization = request.organization
        active_user.availability = request.availability
    
        try:
          
            db.commit()
           
        except IntegrityError:
            db.rollback() 
            raise HTTPException(status_code=400, detail="Conflict: Data already exists.")  
        
        db.refresh(active_user)
        
        return {"message":"you have update your information"}
    