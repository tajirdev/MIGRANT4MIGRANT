from fastapi import FastAPI
from app.database import engine, Base
from app.models.user import User
from app.models.mentor import Mentor

# This triggers the creation of the tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "MIGRANT4MIGRANT API is running"}