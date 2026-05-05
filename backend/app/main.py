from fastapi import FastAPI
from .models import ModelUser
from .database import engine,Base
from .routes import RouteUser,authenticationRoute


# table connection should be here

Base.metadata.create_all(engine)



app = FastAPI()

#all route put them here
app.include_router(RouteUser.router)
app.include_router(authenticationRoute.router)
