"""changed context of alembic config

Revision ID: 8534d811c38f
Revises: 1277d7ada9e0
Create Date: 2026-07-17 16:48:39.125733

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8534d811c38f'
down_revision: Union[str, Sequence[str], None] = '1277d7ada9e0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column('user_profiles', 'modulesTaken')
    op.drop_column('user_profiles', 'modulesToTake')
    op.add_column('user_profiles', sa.Column('modulesTaken', postgresql.ARRAY(sa.String()), nullable=True))
    op.add_column('user_profiles', sa.Column('modulesToTake', postgresql.ARRAY(sa.String()), nullable=True))


def downgrade() -> None:
    op.drop_column('user_profiles', 'modulesTaken')
    op.drop_column('user_profiles', 'modulesToTake')
    op.add_column('user_profiles', sa.Column('modulesTaken', sa.String(), nullable=True))
    op.add_column('user_profiles', sa.Column('modulesToTake', sa.String(), nullable=True))