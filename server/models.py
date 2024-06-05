from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from sqlalchemy.orm import validates
from config import db, bcrypt

# Models go here!
class Barber(db.Model, SerializerMixin):
    __tablename__ = 'barbers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)

    reviews = db.relationship('Review', back_populates = 'barber', cascade = 'all, delete-orphan')

    serialize_rules = ('-reviews.barber',)

    @validates('name')
    def validates_name(self, key, name):
        if not name:
            raise ValueError("Name must exist")
        elif len(name) == 0:
            raise ValueError('Name cannot be an empty string')
        else:
            return name
        
    @validates('email')
    def validates_email(self, key, email):
        if '@' not in email:
            raise ValueError("Failed simple email validation")
        return email

    def __repr__(self):
        return f'<Barber: {self.id}>'

class Client(db.Model, SerializerMixin):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    _password_hash = db.Column(db.String)
    name = db.Column(db.String)
    email = db.Column(db.String, unique=True)

    reviews = db.relationship('Review', back_populates = 'client', cascade = 'all, delete-orphan')

    serialize_rules = ('-reviews.client',)

    @validates('name')
    def validates_name(self, key, name):
        if not isinstance(name, str):
            raise ValueError('Name must be a string')
        elif len(name) == 0:
            raise ValueError('Name cannot be an empty string')
        else:
            return name
        
    @validates('email')
    def validates_email(self, key, email):
        if '@' not in email:
            raise ValueError("Failed simple email validation")
        return email
    
    @validates('_password_hash')
    def validates_password(self, key, password):
        if len(password) < 8:
            raise ValueError("Password must contain 8 characters or more.")
        return password

    @hybrid_property
    def password_hash(self):
        raise AttributeError("You don't have permission to view the password")
    
    @password_hash.setter
    def password_hash(self, password):
        new_hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))

        self._password_hash = new_hashed_password.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<Client: {self.id}>'

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    review_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    rating = db.Column(db.Integer)
    comments = db.Column(db.String)
    date_posted = db.Column(db.DateTime)

    barber_id = db.Column(db.Integer, db.ForeignKey('barbers.id'))
    client_id = db.Column(db.Integer, db.ForeignKey('clients.id'))

    barber = db.relationship('Barber', back_populates = 'reviews')
    client = db.relationship('Client', back_populates = 'reviews')

    serialize_rules = ('-barber.reviews', '-client.reviews')

    @validates('title')
    def validates_title(self, key, title):
        if not isinstance(title, str):
            raise ValueError("title must be an integer")
        else:
            return title
        
    @validates('rating')
    def validates_rating(self, key, rating):
        if not isinstance(rating, int):
            raise ValueError("rating must be an integer")
        else:
            return rating

    def __repr__(self):
        return f'<Review: {self.review_id}>'