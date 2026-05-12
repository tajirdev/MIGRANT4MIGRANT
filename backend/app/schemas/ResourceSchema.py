from pydantic import BaseModel


class Resoureces(BaseModel):

    title :str
    category :str
    description :str
    location : str
    contact : str

class ShowResoureces(BaseModel):
    title :str
    category :str
    description :str
    location : str
    contact : str
    
    class Config:
     from_attributes = True


  