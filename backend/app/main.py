from fastapi import FastAPI,Depends
from .models import models,user
from .database import engine,get_db
from sqlalchemy.orm import session



models.Base.metadata.create_all(engine)
user.Base.metadata.create_all(engine)

app = FastAPI()

#testing docker ignor it
@app.get('/docker')
def docker():
    return {'message':'docker run'}


#testing database connection ignor
@app.get('/db')
def get_db(db:session=Depends(get_db)):
    test = db.query(models.Taste).all()
    return test
