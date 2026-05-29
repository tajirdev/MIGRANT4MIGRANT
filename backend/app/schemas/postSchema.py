from pydantic import BaseModel


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
    author  : postowner

    class Config:
     from_attributes = True

    