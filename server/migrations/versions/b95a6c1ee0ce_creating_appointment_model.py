"""Creating Appointment model

Revision ID: b95a6c1ee0ce
Revises: e0d509a9a352
Create Date: 2024-06-12 08:08:48.013344

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b95a6c1ee0ce'
down_revision = 'e0d509a9a352'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('appointments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('appointment_date', sa.String(), nullable=False),
    sa.Column('appointment_time', sa.String(), nullable=False),
    sa.Column('service_type', sa.String(length=200), nullable=True),
    sa.Column('barber_id', sa.Integer(), nullable=True),
    sa.Column('client_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['barber_id'], ['barbers.id'], name=op.f('fk_appointments_barber_id_barbers')),
    sa.ForeignKeyConstraint(['client_id'], ['clients.id'], name=op.f('fk_appointments_client_id_clients')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('appointments')
    # ### end Alembic commands ###
