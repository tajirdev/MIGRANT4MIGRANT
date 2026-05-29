from app.models import organization
from app.schemas import schemaorganization
from sqlalchemy.orm import Session
from fastapi import Depends,HTTPException,status
from app.core.database import get_db
from sqlalchemy.exc import IntegrityError


class Orginizations:
    def create_orginztion(self,request:schemaorganization.Organizations,db:Session,current_user_id:int):
        new_organitazion = organization.Organization(
            name = request.name,
            type = request.type,
            country = request.country,
            email  = request.email,
            description = request.description,
            services  = request.services
        )
        try:
            db.add(new_organitazion)
            db.commit()
            db.refresh(new_organitazion)
        except IntegrityError:
            db.rollback() 
            raise HTTPException(status_code=400, detail="Conflict: Data already exists.")  
        return new_organitazion
    
    
    def get_organization(self,db:Session,skip: int = 0, limit: int = 20):
        available_organization= db.query(organization.Organization)\
        .order_by(organization.Organization.id.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()

        if not available_organization:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,detail="organization not found in db"
            )
        return available_organization
    


    def getby_id(self,db:Session,id):
        available = db.query(organization.Organization).filter(organization.Organization.id == id).first()

        if not available:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"resource with id of {id} not found"
            )
        return available
    

    def update_organization(self,request:organization.Organization,db:Session,id):
        get_availble_orgizations = db.query(organization.Organization).filter(organization.Organization.id == id).first()

        if not get_availble_orgizations:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"resource with id of {id} not found"
            )
        else:
            get_availble_orgizations.name = request.name,
            get_availble_orgizations.type = request.type,
            get_availble_orgizations.country = request.country,
            get_availble_orgizations.email  = request.email,
            get_availble_orgizations.description = request.description,
            get_availble_orgizations.services  = request.services

        try:
            db.commit()
            db.refresh(get_availble_orgizations)
        except IntegrityError:
            db.rollback() 
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return get_availble_orgizations
    

    def delete_orgaization(self,id,db:Session):
        available = db.query(organization.Organization).filter(organization.Organization.id == id).delete(synchronize_session=False)

        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return {"message" :f"blog with id {id} has been deleted"}


