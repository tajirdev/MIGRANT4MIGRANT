from fastapi import FastAPI
from .models import ModelUser
from .database import engine
from .routes import RouteUser


# table connection should be here

ModelUser.Base.metadata.create_all(engine)



app = FastAPI()

#all route put them here
app.include_router(RouteUser.router)
