"""Merging conflicting heads

Revision ID: 4e0178abc216
Revises: 3e7377e73593, e1e773fc121e
Create Date: 2026-05-28 17:13:47.484203

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4e0178abc216'
down_revision: Union[str, Sequence[str], None] = ('3e7377e73593', 'e1e773fc121e')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
