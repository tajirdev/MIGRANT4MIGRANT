from pydantic import BaseModel, EmailStr


class OrganizationCreate(BaseModel):
    name: str
    type: str | None = None
    country: str | None = None
    email: EmailStr | None = None
    verified: bool | None = False
    description: str | None = None
    services: str | None = None


class OrganizationUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    country: str | None = None
    email: EmailStr | None = None
    verified: bool | None = None
    description: str | None = None
    services: str | None = None


class OrganizationOut(BaseModel):
    id: int
    name: str
    type: str | None = None
    country: str | None = None
    email: EmailStr | None = None
    verified: bool | None = False
    description: str | None = None
    services: str | None = None

    class Config:
        from_attributes = True
