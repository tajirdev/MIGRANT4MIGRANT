from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import schemasResources  
from app.services.PostServices import Post_Service
from app.core.authorization import RoleChecker
from app.schemas import schemaUser,postSchema

service_post = Post_Service()
mentor_and_admin = RoleChecker(["mentor", "admin"])
all = RoleChecker(["mentor","admin","migrant"])

router = APIRouter(
    tags=['POST'],
)



@router.post("/create")
def new_post(
    request:postSchema.Post,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant=Depends(mentor_and_admin)
    ):
    return service_post.create_post(request,db,current_user_id=current_user.id)


@router.get("/posts")
def read_post( db: Session = Depends(get_db),current_user:schemaUser.migrant=Depends(all)):
    return service_post.get_all_posts(db)


@router.get("/{id}")
def GetbyId(
    id,
    db:Session=Depends(get_db),
    current_user:schemaUser.migrant= Depends(all)
    ):
    return service_post.getby_id(db,id)



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


