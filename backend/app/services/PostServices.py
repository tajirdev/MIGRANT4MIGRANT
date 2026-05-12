from sqlalchemy.orm import Session
from app.models.post import Post
from fastapi import HTTPException,status,Depends
from typing import Optional


class Post_Service:

    def delete_post(self, db: Session, post_id: int):

        delete_post = db.query(Post).filter(Post.id == post_id).first()


        if not delete_post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,detail= f"Post with id of {post_id} not found"
                )

        db.delete(delete_post)
        db.commit()

        return {"message": f"Post with id {post_id} deleted successfully"}
    

    
    def get_all_posts(self,db: Session):
        query = db.query(Post).all()

        if not query:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="blogs not found in database"
            )
        return query

