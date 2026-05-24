from pydantic import BaseModel
class  EmergencyContact(BaseModel):

    country : str
    service_name : str
    phone: str