from sqlalchemy.orm import Session
from app.schemas import SchemaMentor
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import schemaUser
from app.services.MentorService import Mentor
from app.core.authorization import RoleChecker


ServiceMentor = Mentor()

mentor_and_admin = RoleChecker(["migrant"])

router = APIRouter(
    tags=['Mentor'],
    prefix="/register"
)

@router.post('/mentor')
def register_mentor_route(request:SchemaMentor.Mentor,db:Session=Depends(get_db),current_user:schemaUser.migrant=Depends(mentor_and_admin)):
    return ServiceMentor.register_mentor(request,db,current_user_id=current_user.id)
    