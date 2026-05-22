from fastapi import HTTPException,status
from sqlalchemy.orm import Session
from app.schemas import ResourceSchema
from sqlalchemy.orm import Session
from app.models import mentor,resource
from sqlalchemy.orm import Session
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

class Resource:

    def create_resource(self,request:ResourceSchema.Resoureces,db:Session,current_user_id:int):
        current_mentor = db.query(mentor.Mentor).filter(mentor.Mentor.user_id == current_user_id).first()
        new_resourece = resource.Resource(
            title = request.title,
            category = request.category,
            description = request.description,
            location = request.location,
            contact = request.contact,
            added_by = current_mentor.id
        )
        try:
            db.add(new_resourece)
            db.commit()
            db.refresh(new_resourece)
        except IntegrityError:
            db.rollback() 
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return new_resourece
    
    def get_resource(self,db:Session,current_user_id: int):
        available_resouirce= db.query(resource.Resource).all()

        if not available_resouirce:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,detail="blog not found in db"
            )
        return available_resouirce
    

    def getby_id(self,db:Session,id):
        available = db.query(resource.Resource).filter(resource.Resource.id == id).first()

        if not available:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"resource with id of {id} not found"
            )
        return available
    

    def update_resource(self,request:ResourceSchema.Resoureces,db:Session,id):
        get_resource = db.query(resource.Resource).filter(resource.Resource.id == id).first()

        if not get_resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"resource with id of {id} not found"
            )
        else:
            get_resource.title = request.title
            get_resource.description = request.description
            get_resource.category = request.category
            get_resource.contact = request.contact
            get_resource.location = request.location

        try:
            db.commit()
            db.refresh(get_resource)
        except IntegrityError:
            db.rollback() 
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return get_resource
    

    def delete_resource(self,id,db:Session):
        available = db.query(resource.Resource).filter(resource.Resource.id == id).delete(synchronize_session=False)

        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return {"message" :f"blog with id {id} has been deleted"}







            

