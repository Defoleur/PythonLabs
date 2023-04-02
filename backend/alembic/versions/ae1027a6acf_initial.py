from alembic import op
import sqlalchemy as sa

revision = 'ae1027a6acf'
down_revision = None


def upgrade():
    op.add_column('user', sa.Column('phone', sa.String))


def downgrade():
    op.drop_column('user', 'phone')