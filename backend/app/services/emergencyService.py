from fastapi import HTTPException,status
from sqlalchemy.orm import Session
from app.schemas import emegencySchema
from sqlalchemy.orm import Session
from app.models import emergency_contact
from sqlalchemy.orm import Session
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

class Emergency:

    def create_Emergency(self,request:emegencySchema.EmergencyContact,db:Session,current_user_id:int):
        new_emergency = emergency_contact.EmergencyContact (
                 country = request.country,
                 service_name = request.service_name,
                 phone = request.phone
        )
        try:
            db.add(new_emergency)
            db.commit()
            db.refresh(new_emergency)
        except IntegrityError:
            db.rollback() 
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return new_emergency
    
    def get_Emergency(self,db:Session,current_user_id: int):
        available_emergency= db.query(emergency_contact.EmergencyContact).all()

        if not available_emergency:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,detail="blog not found in db"
            )
        return available_emergency
    

    def getby_id(self,db:Session,id):
        available = db.query(emergency_contact.EmergencyContact).filter(emergency_contact.EmergencyContact.id == id).first()

        if not available:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"resource with id of {id} not found"
            )
        return available
    

    def update_Emergency(self,request:emegencySchema.EmergencyContact,db:Session,id):
        get_emergency = db.query(emergency_contact.EmergencyContact).filter(emergency_contact.EmergencyContact.id == id).first()

        if not get_emergency:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"resource with id of {id} not found"
            )
        else:
            get_emergency.country = request.country
            get_emergency.service_name = request.service_name
            get_emergency.phone = request.phone


        try:
            db.commit()
            db.refresh(get_emergency)
        except IntegrityError:
            db.rollback() 
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return get_emergency
    

    def delete_Emergency(self,id,db:Session):
        available = db.query(emergency_contact.EmergencyContact).filter(emergency_contact.EmergencyContact.id == id).delete(synchronize_session=False)

        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return {"message" :f"blog with id {id} has been deleted"}







            

