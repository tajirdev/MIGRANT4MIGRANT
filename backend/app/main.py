from fastapi import FastAPI
from .core.database import engine,Base
from .routes import RouteUser,authenticationRoute,adminRoute,MentorRouter,RouterService


# table connection should be here

Base.metadata.create_all(engine)



app = FastAPI()

#all route put them here
app.include_router(RouteUser.router)
app.include_router(authenticationRoute.router)
app.include_router(adminRoute.router)
app.include_router(MentorRouter.router)
app.include_router(RouterService.router)
