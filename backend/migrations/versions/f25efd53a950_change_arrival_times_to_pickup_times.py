"""change arrival times to pickup times

Revision ID: f25efd53a950
Revises: 809a9aed5816
Create Date: 2024-05-27 10:26:14.850215

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f25efd53a950'
down_revision = '809a9aed5816'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ride', schema=None) as batch_op:
        batch_op.add_column(sa.Column('earliest_pickup_time', sa.DateTime(), nullable=False))
        batch_op.add_column(sa.Column('latest_pickup_time', sa.DateTime(), nullable=False))
        batch_op.drop_column('earliest_arrival_time')
        batch_op.drop_column('latest_arrival_time')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('ride', schema=None) as batch_op:
        batch_op.add_column(sa.Column('latest_arrival_time', sa.DATETIME(), nullable=False))
        batch_op.add_column(sa.Column('earliest_arrival_time', sa.DATETIME(), nullable=False))
        batch_op.drop_column('latest_pickup_time')
        batch_op.drop_column('earliest_pickup_time')

    # ### end Alembic commands ###
