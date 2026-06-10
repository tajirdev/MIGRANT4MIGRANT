from pydantic import BaseModel, EmailStr,field_serializer, Field
from datetime import datetime,date




# user data varidation
class migrant(BaseModel):
    name : str
    user_name :str
    email :EmailStr
    password_hash : str
    role : str
    language :str
    current_country: str
    native_country: str

class showUser(BaseModel):
    name : str
    user_name :str
    email :EmailStr
    role : str
    language :str
    current_country: str
    native_country: str
    created_at : datetime
    
    @field_serializer("created_at")
    def serializer_date(self,value):
       return value.date()
  

     
    class Config:
     from_attributes = True
class Edite(BaseModel):
        
        name :str
        user_name :str
        
        language :str
        current_country :str
        native_country : str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr
class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6, description="The 6-digit numeric verification code")

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str = Field(..., min_length=8, description="The new password choice")
