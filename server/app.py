#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Barber, Client, Review


# Views go here!

# @app.route('/')
# def index():
#     return '<h1>Project Server</h1>'

class Barbers(Resource):
    def get(self):
        barbers = [barber.to_dict(rules = ('-reviews.client', '-reviews.barber_id', '-reviews.client_id')) for barber in Barber.query.all()]

        return make_response(jsonify(barbers), 200)
    
class Clients(Resource):
    pass

class Reviews(Resource):
    pass

api.add_resource(Barbers, '/barbers')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

