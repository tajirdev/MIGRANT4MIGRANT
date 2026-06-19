from sqlalchemy.orm import Session
from app.schemas import admin
from app.models import migrants
from app.core import security
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError




class Admin:
       # admin logic
   def crate_new_admin(self,request:admin.Admin,db:Session):
    new_admin = migrants.Migrant(
        name = request.name,
        user_name = request.user_name,
        email = request.email,
        password_hash = security.Hash.hash(request.password_hash),
        role = 'admin'
    )
    try:
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
    except IntegrityError:
        db.rollback() 
        raise HTTPException(status_code=400, detail="Conflict: Data already exists.") 

    return new_admin