'''
from sqlalchemy.orm import Session
from app.models import Post


def get_all_posts(db: Session, category: Optional[str] = None):
    query = db.query(Post)
    if category:
        query = query.filter(Post.category == category)
    return query.all()
    '''
# DO NOT RUB THESE CODES HAVE SOME ERROR
