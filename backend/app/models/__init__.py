from app.core.database import Base
from .migrant import migrant
from .mentor import Mentor
from .organization import Organization
from .resource import Resource
from .post import Post
from .emergency_contact import EmergencyContact

# This allows Alembic to see everything through Base.metadata
__all__ = ["Base", "migrant", "Mentor", "Organization", "Resource", "Post", "EmergencyContact"]