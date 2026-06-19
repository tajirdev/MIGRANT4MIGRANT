from pydantic import BaseModel


# user data varidation
class Admin(BaseModel):
    name : str
    user_name :str
    email :str
    password_hash : str
