from fastapi import FastAPI
from .models import ModoleUser
from .database import engine
from .routes import RouteUser


# table connection should be here

ModoleUser.Base.metadata.create_all(engine)



app = FastAPI()

#all route put them here
app.include_router(RouteUser.router)
