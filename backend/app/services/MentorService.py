from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas import SchemaMentor
from sqlalchemy.orm import Session
from app.models import mentor,migrants




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

        return {'message':"yo have been updated to mentor"}
    