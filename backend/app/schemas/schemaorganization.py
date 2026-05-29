from pydantic import BaseModel,EmailStr

class Organizations(BaseModel):
    name : str
    type: str
    country: str
    email : EmailStr | None = None 
    description : str 
    services : str

class ShowOrganizatios(BaseModel):
    name : str
    type: str
    country: str
    email : EmailStr
    description : str 
    services : str

    class Config:
        from_attributes = True

