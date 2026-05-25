from sqlalchemy.orm import Session
from app.schemas import emegencySchema
from sqlalchemy.orm import Session
from sqlalchemy.orm import Session
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import schemaUser
from app.services.emergencyService import Emergency
from app.core.authorization import RoleChecker
from typing import List


ServiceRecorce = Emergency()
mentor_and_admin = RoleChecker(["mentor", "admin"])
all = RoleChecker(["mentor","admin","migrant"])


router = APIRouter(
    prefix = "/emergency",
    tags=['emergency']
)

@router.post("/create")
def post_resource(
    request:emegencySchema.EmergencyContact,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant=Depends(mentor_and_admin)
    ):
    return ServiceRecorce.create_Emergency(request,db,current_user_id=current_user.id)


@router.get("/all",response_model=List[emegencySchema.EmergencyContact])
def get_all(db:Session=Depends(get_db),current_user:schemaUser.migrant=Depends(all)):
    return ServiceRecorce.get_Emergency(db,current_user_id=current_user.id)


@router.get("/{id}")
def GetbyId(
    id,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(all)
    ):
    return ServiceRecorce.getby_id(db,id)


@router.put("/edit/{id}")
def edit(
    id,
    request:emegencySchema.EmergencyContact,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(mentor_and_admin)
):
    return ServiceRecorce.update_Emergency(request,db,id)


@router.delete("/delete/{id}")
def remove(
    id,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(mentor_and_admin)
):
    return ServiceRecorce.delete_Emergency(id,db)
