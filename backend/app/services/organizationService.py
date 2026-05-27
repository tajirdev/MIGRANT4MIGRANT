from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.schemas import organization as org_schema
from app.models import organization as org_model


class OrganizationService:

    def createOrganization(self, request: org_schema.OrganizationCreate, db: Session):
        new_org = org_model.Organization(
            name=request.name,
            type=request.type,
            country=request.country,
            email=request.email,
            verified=request.verified,
            description=request.description,
            services=request.services,
        )
        try:
            db.add(new_org)
            db.commit()
            db.refresh(new_org)
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Conflict: Data already exists.")

        return new_org

    def get_all_organizations(self, db: Session):
        orgs = db.query(org_model.Organization).all()
        if not orgs:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No organizations found")
        return orgs

    def getOrganization_by_id(self, db: Session, org_id: int):
        org = db.query(org_model.Organization).filter(org_model.Organization.id == org_id).first()
        if not org:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
        return org

    def updateOrganization(self, request: org_schema.OrganizationUpdate, db: Session, org_id: int):
        org = db.query(org_model.Organization).filter(org_model.Organization.id == org_id).first()
        if not org:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")

        # update fields if provided
        for field, value in request.__dict__.items():
            if value is not None:
                setattr(org, field, value)

        try:
            db.add(org)
            db.commit()
            db.refresh(org)
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Conflict: Data already exists.")

        return org

    def deleteOrganization(self, db: Session, org_id: int):
        deleted = db.query(org_model.Organization).filter(org_model.Organization.id == org_id).delete(synchronize_session=False)
        if not deleted:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
        try:
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database")
        return {"message": "Organization deleted"}
