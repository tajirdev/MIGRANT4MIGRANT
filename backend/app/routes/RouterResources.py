from sqlalchemy.orm import Session
from app.schemas import ResourceSchema
from fastapi import APIRouter,Depends
from app.core.database import get_db
from app.schemas import schemaUser
from app.services.ResourcesService import Resource
from app.core.authorization import RoleChecker
from typing import List
from app.core.authorization import get_current_user


ServiceRecorce = Resource()
mentor_and_admin = RoleChecker(["mentor", "admin"])



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
def get_all(db:Session=Depends(get_db),current_user:schemaUser.migrant=Depends(get_current_user)):
    return ServiceRecorce.get_resource(db,current_user_id=current_user.id)

@router.get("/all/me",response_model=List[ResourceSchema.ShowResoureces])
def get_post_me(
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant = Depends(mentor_and_admin),
    skip : int = 0,
    limit : int = 50
    ):
    return ServiceRecorce.get_my_resources(db,skip,limit,current_user_id=current_user.id)



@router.get("/{id}")
def GetbyId(
    id,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(get_current_user)
    ):
    return ServiceRecorce.getby_id(db,id)


@router.put("/edit/{update_id}")
def edit(
    update_id,
    request:ResourceSchema.Resoureces,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(mentor_and_admin)
):
    return ServiceRecorce.update_resource(request,db,update_id,current_user_id=current_user.id)


@router.delete("/delete/{delete_id}")
def remove(
    delete_id,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(mentor_and_admin)
):
    return ServiceRecorce.delete_resource(delete_id,db,cuurent_user_id=current_user.id)
