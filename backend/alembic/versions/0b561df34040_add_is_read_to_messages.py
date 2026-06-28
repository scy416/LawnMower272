"""add_is_read_to_messages

Revision ID: 0b561df34040
Revises: 9c773aed31c9
Create Date: 2026-06-20 12:15:23.054960

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0b561df34040'
down_revision: Union[str, Sequence[str], None] = '9c773aed31c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('messages', sa.Column('is_read', sa.Boolean(), nullable=True, server_default=sa.false()))
    op.execute("UPDATE messages SET is_read = 0 WHERE is_read IS NULL")


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('messages', 'is_read')
