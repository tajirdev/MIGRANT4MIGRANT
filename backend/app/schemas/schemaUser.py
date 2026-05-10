from pydantic import BaseModel, EmailStr


# user data varidation
class migrant(BaseModel):
    name : str
    user_name :str
    email :EmailStr
    password_hash : str
    role : str
    language :str
    country : str
    current_country: str
    native_country: str

class showUser(BaseModel):
    user_name:str
    email: str
    role:str  

     
    class Config:
     from_attributes = True

  
