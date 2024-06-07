#!/usr/bin/env python3

from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from sqlalchemy_serializer import SerializerMixin

from config import app, db, api
from datetime import datetime

from models import Barber, Client, Review


class Signup(Resource):

    def post(self):
        form_data = request.get_json()

        name = form_data.get('name')
        email = form_data.get('email')
        password = form_data.get('password')

        if not name or not email or not password:
            return {"error": "Missing name, email, or password"}, 400
        try:
            new_client = Client(
                name = name,
                email = email
            )

            new_client.password_hash = password

        
            db.session.add(new_client)
            db.session.commit()

            session['client_id'] = new_client.id

            return new_client.to_dict(), 201
        
        except IntegrityError:
            db.session.rollback()
            return {"error:": "Email already exists"}, 422
        
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 422
        
class CheckSession(Resource, SerializerMixin):

    def get(self):
        
        id = session.get('client_id')

        if id:
            client = Client.query.filter_by(id=id).first()
            return client.to_dict(), 200
        else:
            return {}, 200
    
class Login(Resource):
    
    def post(self):
        
        form_data = request.get_json()

        email = form_data.get('email')
        password = form_data.get('password')

        client = Client.query.filter_by(email=email).first()
        print(client)

        if client and client.authenticate(password):
            session['client_id'] = client.id
            print(session['client_id'])
            print(client.id)

            return client.to_dict(), 200
        
        else:
            return {'error': "Username or Password didn't match."}, 422
    
class Logout(Resource):
    
    def delete(self):

        if session.get('client_id'):
            del session['client_id']
            return  {'message': 'You are not logged in.'}, 200
        else:
            return {'error': 'You are already logged out.'}, 401

class Clients(Resource):

    def get(self):

        if session.get('client_id'):
            id = session.get('client_id')
            client = Client.query.filter_by(id=id).first()

            return client.to_dict(), 200
    
class Barbers(Resource):

    def get(self):

        barber_dict = [barber.to_dict(rules=('-reviews',)) for barber in Barber.query.all()]
        
        return barber_dict, 200
    
    def post(self):

        data_request = request.get_json()

        name = data_request.get('name')
        email = data_request.get('email')

        new_barber = Barber(
            name=name,
            email=email
        )

        db.session.add(new_barber)
        db.session.commit()

        return new_barber.to_dict(), 201
    
class Reviews(Resource):
    
    def get(self):

        reviews = Review.query.all()
        review_dict = [review.to_dict() for review in reviews]

        return review_dict, 200
    
class ReviewsById(Resource):

    def get(self, id):

        review = Review.query.filter_by(review_id=id).first()

        return review.to_dict(), 200
        

    def patch(self, id):
        review = Review.query.filter(Review.review_id == id).first()
        
        if not review:
            return {"error": "Review not found"}, 404

        for attr in request.json:
            setattr(review, attr, request.json[attr])

        try:
            db.session.add(review)
            db.session.commit()
            return review.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    def delete(self, id):
        review = Review.query.filter_by(review_id=id).first()
        if not review:
            return {"error": "Review not found"}, 404

        try:
            db.session.delete(review)
            db.session.commit()
            return {"message": "Review successfully deleted"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
class ReviewsIndex(Resource):

    def get(self):

        if 'client_id' not in session:
            return {"error": "Client not logged in"}, 401
        
        client_session = session.get('client_id')
        client = Client.query.filter(Client.id == client_session).first()
            
        if not client:
            return {"error": "Client not found"}, 404
        else:
            reviews = [review.to_dict() for review in client.reviews]
            return reviews, 200

    def post(self):
        if 'client_id' not in session:
            return {"error": "Client not logged in"}, 401
        
        request_json = request.get_json()

        title = request_json.get('title')
        rating = request_json.get('rating')
        comments = request_json.get('comments')
        barber_id = request_json.get('barber_id')
        
        if not barber_id:
            return {"error": "Barber not selected"}, 400

        try:
            new_review = Review(
                title=title,
                rating=int(rating),
                comments=comments,
                date_posted=datetime.now(),
                client_id=session['client_id'],
                barber_id=barber_id
            )
            db.session.add(new_review)
            db.session.commit()

            return new_review.to_dict(), 201
        
        except IntegrityError:
            db.session.rollback()
            return {'error': '422 Unprocessable Entity'}, 422
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        

api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Clients, '/clients', endpoint='clients')
api.add_resource(Barbers, '/barbers', endpoint='barbers')
api.add_resource(Reviews, '/reviews', endpoint='reviews')
api.add_resource(ReviewsById, '/reviews/<int:id>')
api.add_resource(ReviewsIndex, '/reviews_index', endpoint='reviews_index')

if __name__ == '__main__':
    app.run(port=5000, debug=True)