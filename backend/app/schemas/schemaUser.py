from pydantic import BaseModel


# user data varidation
class User(BaseModel):
    name : str
    user_name :str
    email :str
    password_hash : str
    role : str
    language :str
    country : str

class showUser(BaseModel):
    user_name:str
    email: str
    role:str  
     
    class Config:
     from_attributes = True
 
    
