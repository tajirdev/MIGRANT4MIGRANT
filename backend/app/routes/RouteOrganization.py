from sqlalchemy.orm import Session
from app.schemas import schemaorganization
from fastapi import APIRouter,Depends
from app.core.database import get_db
from app.schemas import schemaUser
from app.services.ServiceOrginization import Orginizations
from app.core.authorization import RoleChecker
from typing import List
from app.core.authorization import get_current_user

serviceOrganization = Orginizations()
admin = RoleChecker(["admin"])



router = APIRouter(
    prefix = "/organization",
    tags=['Orgization']
)

@router.post("/create",response_model=schemaorganization.ShowOrganizatios)
def post_oragization(
    request:schemaorganization.Organizations,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant=Depends(admin)
    ):
    return serviceOrganization.create_orginztion(request,db,current_user_id=current_user.id)


@router.get("/all",response_model=List[schemaorganization.ShowOrganizatios])
def get_all(
    db:Session=Depends(get_db),
    skip: int = 0,
    limit: int = 20
    ):
    return serviceOrganization.get_organization(db,skip,limit)



@router.get("/{id}",response_model=schemaorganization.ShowOrganizatios)
def GetbyId(
    id,
    db:Session=Depends(get_db)
    ):
    return serviceOrganization.getby_id(db,id)


@router.put("/edit/{id}",response_model=schemaorganization.ShowOrganizatios)
def edit(
    id,
    request:schemaorganization.Organizations,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(admin)
):
    return serviceOrganization.update_organization(request,db,id)


@router.delete("/delete/{id}")
def remove(
    id,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(admin)
):
    return serviceOrganization.delete_orgaization(id,db)
