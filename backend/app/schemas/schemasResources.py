from pydantic import BaseModel

class Resource(BaseModel):
    name : str
    description : str
    link : str
    organization : str | None = None   