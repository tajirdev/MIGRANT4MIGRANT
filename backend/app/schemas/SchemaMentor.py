from pydantic import BaseModel

class Mentor(BaseModel):
    expertise : str
    languages : str
    availability : str
    organization : str | None = None   