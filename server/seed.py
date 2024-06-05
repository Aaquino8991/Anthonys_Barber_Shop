#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime, timedelta

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Barber, Client, Review

fake = Faker()


def generate_unique_username(model, fake):
    while True:
        username = fake.user_name()
        if not model.query.filter_by(username=username).first():
            return username


def create_barbers():
    barbers = []
    for n in range(5):
        new_barber = Barber(
            name = fake.first_name(),
            email = fake.email()
        )
        barbers.append(new_barber)

    return barbers


def create_clients():
    clients = []
    for n in range(10):
        new_client = Client(
            _password_hash = fake.password(),
            name = fake.name(),
            email = fake.email()
        )
        clients.append(new_client)

    return clients

def create_reviews(barbers, clients):
    reviews = []
    for n in range(15):
        start_date = '-30d'
        end_date = 'now'
        datetime_posted = fake.date_time_between(start_date=start_date, end_date=end_date)
        date_posted=datetime_posted.date()
        new_review = Review(
            title=fake.text(max_nb_chars=15),
            rating=randint(1, 5),
            comments=fake.text(max_nb_chars=275),
            date_posted=date_posted,
            barber_id=rc([barber.id for barber in barbers]),
            client_id=rc([client.id for client in clients])
        )
        reviews.append(new_review)
    
    return reviews



if __name__ == '__main__':
    with app.app_context():

        print("Deleting all records...")
        Barber.query.delete()
        Client.query.delete()
        Review.query.delete()
        
        print('Seeding barbers...')
        barbers = create_barbers()
        db.session.add_all(barbers)
        db.session.commit()
        
        print('Seeding clients...')
        clients = create_clients()
        db.session.add_all(clients)
        db.session.commit()

        print('Seeding reviews...')
        reviews = create_reviews(barbers, clients)
        db.session.add_all(reviews)
        db.session.commit()

        print("Done!")