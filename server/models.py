from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
class Barber(db.Model, SerializerMixin):
    __tablename__ = 'barbers'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    phone_number = db.Column(db.Integer)
    experience = db.Column(db.String)

    appointments = db.relationship('Appointment', back_populates = 'barber', cascade = 'all, delete-orphan')

    serialize_rules = ('-appointments.barber')

    def __repr__(self):
        return f'<Barber: {self.id}>'

class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    phone_number = db.Column(db.Integer)

    appointments = db.relationship('Appointment', back_populates = 'client', cascade = 'all, delete-orphan')

    serialize_rules = ('-appointments.client')

    def __repr__(self):
        return f'<Client: {self.id}>'

class Appointment(db.Model, SerializerMixin):
    __tablename__ = 'appointments'

    appointment_id = db.Column(db.Integer, primary_key=True)
    appointment_date = db.Column(db.DateTime)
    appointment_time = db.Column(db.DateTime)
    service_type = db.Column(db.String)

    barber_id = db.Column(db.Integer, db.ForeignKey('barbers.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))

    barber = db.relationship('Barber', back_populates = 'appointments')
    client = db.relationship('Client', back_populates = 'appointments')

    # reviews = db.relationship('Review', backref = 'appointment')

    serialize_rules = ('-barber.appoinments', '-client.appointments')

    def __repr__(self):
        return f'<Appointment: {self.appointment_id}>'

# class Review(db.Model, SerializerMixin):
#     __tablename__ = 'reviews'

#     review_id = db.Column(db.Integer, primary_key=True)
#     rating = db.Column(db.Integer)
#     comments = db.Column(db.String)
#     date_posted = db.Column(db.DateTime)

#     appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.appointment_id'))

#     def __repr__(self):
#         return f'<Review: {self.review_id}>'