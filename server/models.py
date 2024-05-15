from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
class Barber(db.Model, SerializerMixin):
    __tablename__ = 'barbers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)

    reviews = db.relationship('Review', back_populates = 'barber', cascade = 'all, delete-orphan')

    serialize_rules = ('-reviews.barber',)

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

    reviews = db.relationship('Review', back_populates = 'client', cascade = 'all, delete-orphan')

    serialize_rules = ('-reviews.client',)

    def __repr__(self):
        return f'<Client: {self.id}>'

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    review_id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer)
    comments = db.Column(db.String)
    date_posted = db.Column(db.DateTime)

    barber_id = db.Column(db.Integer, db.ForeignKey('barbers.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))

    barber = db.relationship('Barber', back_populates = 'reviews')
    client = db.relationship('Client', back_populates = 'reviews')

    serialize_rules = ('-barber.reviews', '-client.reviews')

    def __repr__(self):
        return f'<Review: {self.review_id}>'