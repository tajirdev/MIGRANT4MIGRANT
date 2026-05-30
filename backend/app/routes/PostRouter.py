from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.PostServices import Post_Service
from app.core.authorization import RoleChecker
from app.schemas import schemaUser,postSchema
from typing import List
from app.core.authorization import get_current_user

service_post = Post_Service()
mentor_and_admin = RoleChecker(["mentor", "admin"])


router = APIRouter(
    tags=['POST'],
)



@router.post("/create",response_model=postSchema.showPost)
def new_post(
    request:postSchema.Post,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant=Depends(get_current_user)
    ):
    return service_post.create_post(request,db,current_user_id=current_user.id)


@router.get("/posts",response_model=List[postSchema.showPost])
def read_post( db: Session = Depends(get_db),current_user:schemaUser.migrant=Depends(get_current_user)):
    return service_post.get_all_posts(db)


@router.get("/{id}",response_model= postSchema.showPost)
def GetbyId(
    id,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(get_current_user)
    ):
    return service_post.getby_id(db,id)

@router.get("/pots/me",response_model=List[postSchema.showPost])
def get_post_me(
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant = Depends(get_current_user),
    skip : int = 0,
    limit : int = 50
    ):
    return service_post.get_my_post(db,skip,limit,current_user_id=current_user.id)



@router.put("/edit/{id}")
def edit(
    id,
    request:postSchema.Post,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(mentor_and_admin)
):
    return service_post.update_post(request,db,id)




@router.delete("/delete-post/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db),current_user:schemaUser.migrant=Depends(mentor_and_admin)):
    
    return service_post.delete_post(db, post_id)


