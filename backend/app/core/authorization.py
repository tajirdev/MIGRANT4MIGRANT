from fastapi import HTTPException, Depends, status
from app.schemas import schemaUser
from .auth import get_current_user





class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: schemaUser.migrant = Depends(get_current_user)):
    
        if current_user.role == "admin":
            return current_user
            
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have enough permissions"
            )
        return current_user