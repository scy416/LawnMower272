"""add modulesTaken and modulesToTake to UserProfile

Revision ID: 9c773aed31c9
Revises: f1ad9f888d16
Create Date: 2026-06-19 19:22:59.389287

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9c773aed31c9'
down_revision: Union[str, Sequence[str], None] = 'f1ad9f888d16'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema.
    
    NOTE: The local SQLite test.db was set up directly (not via Alembic), so all
    the schema changes (modulesTaken, modulesToTake columns, indexes) already exist.
    For PostgreSQL (production), this migration runs the actual changes via batch operations.
    """
    conn = op.get_bind()
    dialect = conn.dialect.name

    if dialect != 'sqlite':
        # PostgreSQL: run the real migrations
        with op.batch_alter_table('user_profiles') as batch_op:
            batch_op.add_column(sa.Column('modulesTaken', sa.String(), nullable=True))
            batch_op.add_column(sa.Column('modulesToTake', sa.String(), nullable=True))
            try:
                batch_op.drop_column('name')
            except Exception:
                pass
        op.create_index(op.f('ix_friend_requests_receiver_id'), 'friend_requests', ['receiver_id'], unique=False)
        op.create_index(op.f('ix_friend_requests_sender_id'), 'friend_requests', ['sender_id'], unique=False)
    # SQLite (local dev): schema already correct, nothing to do


def downgrade() -> None:
    """Downgrade schema."""
    conn = op.get_bind()
    dialect = conn.dialect.name

    if dialect != 'sqlite':
        op.drop_index(op.f('ix_friend_requests_sender_id'), table_name='friend_requests')
        op.drop_index(op.f('ix_friend_requests_receiver_id'), table_name='friend_requests')
        with op.batch_alter_table('user_profiles') as batch_op:
            batch_op.drop_column('modulesTaken')
            batch_op.drop_column('modulesToTake')
            batch_op.add_column(sa.Column('name', sa.VARCHAR(), nullable=True))
