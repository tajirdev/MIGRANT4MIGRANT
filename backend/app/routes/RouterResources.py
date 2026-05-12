from sqlalchemy.orm import Session
from app.schemas import ResourceSchema
from sqlalchemy.orm import Session
from sqlalchemy.orm import Session
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import schemaUser
from app.services.ResourcesService import Resource
from app.core.authorization import RoleChecker
from typing import List


ServiceRecorce = Resource()
mentor_and_admin = RoleChecker(["mentor", "admin"])
all = RoleChecker(["mentor","admin","migrant"])


router = APIRouter(
    prefix = "/resources",
    tags=[' Resource']
)

@router.post("/create",response_model=ResourceSchema.ShowResoureces)
def post_resource(
    request:ResourceSchema.Resoureces,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant=Depends(mentor_and_admin)
    ):
    return ServiceRecorce.create_resource(request,db,current_user_id=current_user.id)


@router.get("/all",response_model=List[ResourceSchema.ShowResoureces])
def get_all(db:Session=Depends(get_db),current_user:schemaUser.migrant=Depends(all)):
    return ServiceRecorce.get_resource(db,current_user_id=current_user.id)


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
    request:ResourceSchema.Resoureces,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(mentor_and_admin)
):
    return ServiceRecorce.update_resource(request,db,id)


@router.delete("/delete/{id}")
def remove(
    id,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(mentor_and_admin)
):
    return ServiceRecorce.delete_resource(id,db)
