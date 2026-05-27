from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import organization as org_schema
from app.services.organizationService import OrganizationService

router = APIRouter(prefix="/organization", tags=["organization"])

service = OrganizationService()


@router.post("/create", response_model=org_schema.OrganizationOut)
def create_organization(request: org_schema.OrganizationCreate, db: Session = Depends(get_db)):
    return service.createOrganization(request, db)


@router.get("/", response_model=list[org_schema.OrganizationOut])
def list_organizations(db: Session = Depends(get_db)):
    return service.get_all_organizations(db)


@router.get("/{org_id}", response_model=org_schema.OrganizationOut)
def get_organization(org_id: int, db: Session = Depends(get_db)):
    return service.getOrganization_by_id(db, org_id)


@router.put("/update/{org_id}", response_model=org_schema.OrganizationOut)
def update_organization(org_id: int, request: org_schema.OrganizationUpdate, db: Session = Depends(get_db)):
    return service.updateOrganization(request, db, org_id)


@router.delete("/delete/{org_id}")
def delete_organization(org_id: int, db: Session = Depends(get_db)):
    return service.deleteOrganization(db, org_id)
