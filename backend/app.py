from flask import Flask, request, jsonify, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from user import User
from destination import Destination
from extensions import db
from trip import Trip
from review import Review

from datetime import datetime, timedelta
import os
import sys
import secrets

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travel_buddy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['JWT_SECRET_KEY'] = secrets.token_hex(16)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)
jwt = JWTManager(app)

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return make_response(jsonify({"error": "Not found"}), 404)

@app.errorhandler(400)
def bad_request(e):
    return make_response(jsonify({"error": "Bad request"}), 400)

# Home resource
class Home(Resource):
    def get(self):
        return {"message": "Welcome to Travel Buddy API"}

# Authentication resources
class Login(Resource):
    def post(self):
        data = request.get_json()

        if not data or not data.get('username') or not data.get('password'):
            return {"error": "Missing username or password"}, 400

        user = User.query.filter_by(username=data['username']).first()

        if not user or not user.check_password(data['password']):
            return {"error": "Invalid username or password"}, 401

        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        remember_me = data.get('remember_me', False)

        response = {
            "user": user.to_dict(),
            "access_token": access_token,
        }

        if remember_me:
            response["refresh_token"] = refresh_token

        return response, 200

class Register(Resource):
    def post(self):
        data = request.get_json()

        if User.query.filter_by(username=data.get('username')).first():
            return {"error": "Username already exists"}, 400

        if User.query.filter_by(email=data.get('email')).first():
            return {"error": "Email already exists"}, 400

        try:
            new_user = User(
                username=data['username'],
                email=data['email'],
            )
            new_user.password = data['password']
            db.session.add(new_user)
            db.session.commit()

            access_token = create_access_token(identity=new_user.id)
            refresh_token = create_refresh_token(identity=new_user.id)

            return {
                "message": "User created successfully",
                "user": new_user.to_dict(),
                "access_token": access_token,
                "refresh_token": refresh_token
            }, 201

        except ValueError as e:
            db.session.rollback()
            return {"error": str(e)}, 400
        except Exception:
            db.session.rollback()
            return {"error": "An error occurred while creating the user"}, 500

class RefreshToken(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user_id = get_jwt_identity()
        access_token = create_access_token(identity=current_user_id)
        return {"access_token": access_token}, 200

class UserProfile(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return {"error": "User not found"}, 404

        return user.to_dict(), 200

class Users(Resource):
    def get(self):
        users = User.query.all()
        return [user.to_dict() for user in users], 200

    def post(self):
        data = request.get_json()
        try:
            new_user = User(
                username=data['username'],
                email=data['email'],
            )
            new_user.password = data['password']

            db.session.add(new_user)
            db.session.commit()
            return new_user.to_dict(), 201
        except (ValueError, IntegrityError) as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class UserById(Resource):
    def get(self, id):
        user = User.query.get(id)
        if not user:
            return {"error": "User not found"}, 404
        return user.to_dict(), 200

    @jwt_required()
    def patch(self, id):
        current_user_id = get_jwt_identity()
        if int(current_user_id) != int(id):
            return {"error": "Unauthorized"}, 403

        user = User.query.get(id)
        if not user:
            return {"error": "User not found"}, 404

        data = request.get_json()
        try:
            for attr in data:
                if attr in ['username', 'email']:
                    setattr(user, attr, data[attr])
                elif attr == 'password':
                    user.password = data[attr]

            db.session.commit()
            return user.to_dict(), 200
        except (ValueError, IntegrityError) as e:
            db.session.rollback()
            return {"error": str(e)}, 400

    @jwt_required()
    def delete(self, id):
        current_user_id = get_jwt_identity()
        if int(current_user_id) != int(id):
            return {"error": "Unauthorized"}, 403

        user = User.query.get(id)
        if not user:
            return {"error": "User not found"}, 404

        db.session.delete(user)
        db.session.commit()
        return {}, 204

class Destinations(Resource):
    def get(self):
        destinations = Destination.query.all()
        return [destination.to_dict() for destination in destinations], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        try:
            new_destination = Destination(
                name=data['name'],
                category=data['category'],
                description=data['description'],
                image_url=data['image_url']
            )
            db.session.add(new_destination)
            db.session.commit()
            return new_destination.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

class DestinationById(Resource):
    def get(self, id):
        destination = Destination.query.get(id)
        if not destination:
            return {"error": "Destination not found"}, 404
        return destination.to_dict(), 200

    @jwt_required()
    def patch(self, id):
        destination = Destination.query.get(id)
        if not destination:
            return {"error": "Destination not found"}, 404

        data = request.get_json()
        try:
            for attr in data:
                if attr in ['name', 'category', 'description', 'image_url']:
                    setattr(destination, attr, data[attr])

            db.session.commit()
            return destination.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 400

    @jwt_required()
    def delete(self, id):
        destination = Destination.query.get(id)
        if not destination:
            return {"error": "Destination not found"}, 404

        db.session.delete(destination)
        db.session.commit()
        return {}, 204

@app.route('/trips', methods=['POST'])
@jwt_required()
def create_trip():
    data = request.json
    try:
        trip = Trip(
            user_id=data['user_id'],
            destination_id=data['destination_id'],
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
            budget=float(data['budget']),
            note=data.get('note')
        )
        db.session.add(trip)
        db.session.commit()
        return jsonify(trip.to_dict()), 201
    except KeyError as e:
        return jsonify({"error": f"Missing field: {str(e)}"}), 400

@app.route('/trips', methods=['GET'])
def get_trips():
    trips = Trip.query.all()
    return jsonify([trip.to_dict() for trip in trips]), 200

@app.route('/trips/<int:id>', methods=['PUT'])
def update_trip(id):
    trip = Trip.query.get_or_404(id)
    data = request.json

    if 'start_date' in data:
        try:
            trip.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    if 'budget' in data:
        try:
            trip.budget = float(data['budget'])
        except ValueError:
            return jsonify({"error": "Budget must be a valid number."}), 400

    if 'note' in data:
        trip.note = data['note']

    db.session.commit()
    return jsonify(trip.to_dict()), 200

@app.route('/trips/<int:id>', methods=['DELETE'])
def delete_trip(id):
    trip = Trip.query.get(id)
    if trip is None:
        return jsonify({"error": "Trip not found"}), 404

    db.session.delete(trip)
    db.session.commit()
    return jsonify({"message": "Trip deleted"}), 200

@app.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    data = request.json
    try:
        new_review = Review(
            user_id=data['user_id'],
            destination_id=data['destination_id'],
            rating=data['rating'],
            comment=data.get('comment')
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify(new_review.to_dict()), 201
    except KeyError as e:
        return jsonify({"error": f"Missing required field: {str(e)}"}), 400

@app.route('/reviews', methods=['GET'])
def get_reviews():
    destination_id = request.args.get('destination_id')
    if destination_id:
        reviews = Review.query.filter_by(destination_id=destination_id).all()
    else:
        reviews = Review.query.all()
    return jsonify([review.to_dict() for review in reviews]), 200

@app.route('/reviews/<int:id>', methods=['PUT'])
def update_review(id):
    review = Review.query.get_or_404(id)
    data = request.json
    review.rating = data.get('rating', review.rating)
    review.comment = data.get('comment', review.comment)
    db.session.commit()
    return jsonify(review.to_dict()), 200

@app.route('/reviews/<int:id>', methods=['DELETE'])
def delete_review(id):
    review = Review.query.get(id)
    if review is None:
        return jsonify({"error": "Review not found"}), 404

    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review deleted"}), 200

# Register resources
api.add_resource(Home, '/')
api.add_resource(Login, '/login')
api.add_resource(Register, '/register')
api.add_resource(RefreshToken, '/refresh-token')
api.add_resource(UserProfile, '/profile')
api.add_resource(Users, '/users')
api.add_resource(UserById, '/users/<int:id>')
api.add_resource(Destinations, '/destinations')
api.add_resource(DestinationById, '/destinations/<int:id>')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print("Server is running on http://127.0.0.1:5555")
    app.run(host='0.0.0.0', port=5555, debug=True)
