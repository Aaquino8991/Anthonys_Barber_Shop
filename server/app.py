#!/usr/bin/env python3

from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from sqlalchemy_serializer import SerializerMixin

from config import app, db, api, bcrypt
from datetime import datetime, timezone

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

        if client and client.authenticate(password):
            session['client_id'] = client.id

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

        client_dict = [client.to_dict(rules=('-reviews.barber',)) for client in Client.query.all()]
        
        return client_dict, 200
    
class Barbers(Resource):

    def get(self):

        barber_dict = [barber.to_dict(rules=('-reviews',)) for barber in Barber.query.all()]
        
        return barber_dict, 200
    
class BarberById(Resource):

    def get(self, id):

        barber = Barber.query.filter_by(id=id).first()

        return barber.to_dict(), 200
    
class Reviews(Resource):
    
    def get(self):

        reviews = Review.query.all()
        review_dict = [review.to_dict() for review in reviews]

        return review_dict, 200
    
class ReviewsIndex(Resource):

    def get(self):

        # if 'client_id' not in session:
        #     return {"error": "Client not logged in"}, 401
        
        client_session = session.get('client_id')
        client = Client.query.filter(Client.id == client_session).first()
            
        if not client:
            return {"error": "Client not found"}, 404
        else:
            reviews = [review.to_dict() for review in client.reviews]
            print(f"fetched reviews: {reviews}")
            return reviews, 200

    def post(self):
        if 'client_id' not in session:
            return {"error": "Client not logged in"}, 401
        
        request_json = request.get_json()

        title = request_json.get('title')
        rating = request_json.get('rating')
        comments = request_json.get('comments')
        date_posted = request_json.get('date_posted')
        barber_id = request_json.get('barber_id')

        if not barber_id:
            return {"error": "Barber not selected"}, 400

        try:
            new_review = Review(
                title=title,
                rating=rating,
                comments=comments,
                date_posted=datetime.fromisoformat(date_posted),
                client_id=session['client_id'],
                barber_id=barber_id
            )
            print(new_review)
            db.session.add(new_review)
            db.session.commit()

            return new_review.to_dict(), 201
        
        except IntegrityError:
            db.session.rollback()
            return {'error': '422 Unprocessable Entity'}, 422
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        
    def delete(self):
        if 'client_id' not in session:
            return {"error": "Client not logged in"}, 401

        client_id = session['client_id']
        review_id = request.get_json().get('review_id')

        review = Review.query.filter_by(id=review_id).first()

        if not review:
            return {"error": "Review not found"}, 404

        if review.client_id != client_id:
            return {"error": "You do not have permission to delete this review"}, 403

        try:
            db.session.delete(review)
            db.session.commit()
            return {"message": "Review deleted successfully"}, 200

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
api.add_resource(ReviewsIndex, '/reviews_index', endpoint='reviews_index')

if __name__ == '__main__':
    app.run(port=5555, debug=True)