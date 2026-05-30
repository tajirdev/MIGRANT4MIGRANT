from sqlalchemy.orm import Session
from app.models import post,mentor,migrants
from fastapi import HTTPException,status,Depends
from typing import Optional
from app.schemas import postSchema
from sqlalchemy.exc import IntegrityError


class Post_Service:



    def create_post(self,request:postSchema.Post,db:Session,current_user_id:int):
        current_migrant = db.query(migrants.Migrant).filter(migrants.Migrant.id == current_user_id).first()
        new_post = post.Post(
            title = request.title,
            body = request.body,
            category = request.category,
            author_id = current_migrant.id
        )
        try:
            db.add(new_post)
            db.commit()
            db.refresh(new_post)
        except IntegrityError:
            db.rollback() 
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return new_post
    

    def getby_id(self,db:Session,id):
        available = db.query(post.Post).filter(post.Post.id == id).first()

        if not available:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"resource with id of {id} not found"
            )
        return available
    

    
    def update_post(self,request:postSchema.Post,db:Session,id):
        get_post = db.query(post.Post).filter(post.Post.id == id).first()

        if not get_post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= f"resource with id of {id} not found"
            )
        else:
            get_post.title = request.title
            get_post.body = request.body
            get_post.category = request.category

        try:
            db.commit()
            db.refresh(get_post)
        except IntegrityError:
            db.rollback() 
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflict: in database") 
        return get_post

    def delete_post(self, db: Session, post_id: int):

        delete_posts = db.query(post.Post).filter(post.Post.id == post_id).first()




        if not delete_posts:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,detail= f"Post with id of {post_id} not found"
                )

        db.delete(delete_posts)
        db.commit()

        return {"message": f"Post with id {post_id} deleted successfully"}
    

    
    def get_all_posts(self,db: Session):
        query = db.query(post.Post).all()

        if not query:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="blogs not found in database"
            )
        return query
    
    def get_my_post(self, db: Session, skip: int, limit: int, current_user_id: int):
    
        available_posts = db.query(post.Post)\
            .filter(post.Post.author_id == current_user_id)\
            .order_by(post.Post.id.desc())\
            .offset(skip)\
            .limit(limit)\
            .all()
        
        
        if not available_posts:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="You don't have any posts. Please create one."
            )
        
        return available_posts
