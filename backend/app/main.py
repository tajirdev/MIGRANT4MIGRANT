from fastapi import FastAPI
from .core.database import engine,Base
from .routes import PostRouter, RouteUser,authenticationRoute,adminRoute,MentorRouter
from .routes import RouteUser, RouterResources,authenticationRoute,adminRoute,MentorRouter
from fastapi.middleware.cors import CORSMiddleware







# table connection should be here

Base.metadata.create_all(engine)




app = FastAPI()

#this to allow frontend to talk to backend
origins = [
    "http://localhost:3000",    # React/Next.js default
    "http://127.0.0.1:5500",   # Live Server default
    "https://yourdomain.com",  # Production domain
    "http://192.168.1.196:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Allowed list of origins
    allow_credentials=True,         # Allow cookies/authentication headers
    allow_methods=["*"],            # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],            # Allow all headers
)

#all route put them here
app.include_router(RouteUser.router)
app.include_router(authenticationRoute.router)
app.include_router(adminRoute.router)
app.include_router(MentorRouter.router)
app.include_router(PostRouter.router)
app.include_router(RouterResources.router)
