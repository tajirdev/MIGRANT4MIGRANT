from sqlalchemy.orm import Session
from backend.app.models.post import Post


class ResourceService:

    def delete_post(self, db: Session, post_id: int):

        delete_post = db.query(Post).filter(Post.id == post_id).first()

        if delete_post:
            db.delete(delete_post)
            db.commit()

            return {"message": "Post deleted successfully"}

        else:
            return {"message": "Post not found"}
