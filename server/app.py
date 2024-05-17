#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api, bcrypt
from datetime import datetime
# Add your model imports
from models import Barber, Client, Review


# Views go here!

# Signup endpoint
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    name = data.get('name')
    email = data.get('email')
    phone_number = data.get('phone_number')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_client = Client(username=username, _password_hash=hashed_password, name=name, email=email, phone_number=phone_number)

    db.session.add(new_client)
    db.session.commit()

    return jsonify({'message': 'Signup successful'}), 201

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    client = Client.query.filter_by(username=username).first()

    if not client or not bcrypt.check_password_hash(client._password_hash, password):
        return jsonify({'message': 'Invalid username or password'}), 401

    session['client_id'] = client.id

    return jsonify({'message': 'Login successful'}), 200

# Logout endpoint
@app.route('/logout', methods=['DELETE'])
def logout():
    session.pop('client_id', None)
    return jsonify({'message': 'Logout successful'}), 200

# Reviews endpoints
@app.route('/reviews', methods=['GET'])
def get_reviews():
    reviews = Review.query.all()
    return jsonify([review.to_dict(rules = ('-barber', '-client')) for review in reviews]), 200

@app.route('/reviews', methods=['POST'])
def create_review():
    if 'client_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.json
    rating = data.get('rating')
    comments = data.get('comments')
    date_posted = datetime.now()
    barber_id = data.get('barber_id')

    client_id = session['client_id']

    new_review = Review(rating=rating, comments=comments, date_posted=date_posted, barber_id=barber_id, client_id=client_id)

    db.session.add(new_review)
    db.session.commit()

    return jsonify({'message': 'Review created successfully'}), 201

@app.route('/reviews/<int:review_id>', methods=['PATCH'])
def update_review(review_id):
    if 'client_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401

    review = Review.query.get(review_id)

    if not review:
        return jsonify({'message': 'Review not found'}), 404

    if review.client_id != session['client_id']:
        return jsonify({'message': 'Unauthorized to update this review'}), 403

    data = request.json
    review.rating = data.get('rating', review.rating)
    review.comments = data.get('comments', review.comments)

    db.session.commit()

    return jsonify({'message': 'Review updated successfully'}), 200

@app.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    if 'client_id' not in session:
        return jsonify({'message': 'Unauthorized'}), 401

    review = Review.query.get(review_id)

    if not review:
        return jsonify({'message': 'Review not found'}), 404

    if review.client_id != session['client_id']:
        return jsonify({'message': 'Unauthorized to delete this review'}), 403

    db.session.delete(review)
    db.session.commit()

    return jsonify({'message': 'Review deleted successfully'}), 200


if __name__ == '__main__':
    app.run(port=5555, debug=True)