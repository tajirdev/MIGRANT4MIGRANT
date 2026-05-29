from pydantic import BaseModel
from app.schemas.schemaUser import showUserName
from datetime import datetime

class postowner(BaseModel):
   name:str

   class Config:
        from_attributes = True

class Post(BaseModel):
    title : str
    body :str
    category : str

class showPost(BaseModel):
    title : str
    body :str
    category : str
    created_at : datetime
    author  : postowner

    class Config:
     from_attributes = True

    