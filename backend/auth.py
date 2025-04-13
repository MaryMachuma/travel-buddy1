# auth.py
from flask import Blueprint, request, jsonify
from flask_restful import Api, Resource
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from user import User
from extensions import db

# Create a blueprint for authentication endpoints
auth_bp = Blueprint('auth', __name__)
api = Api(auth_bp)

# Authentication resources as classes for Flask-RESTful
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

# Register resources with the API
api.add_resource(Login, '/login')
api.add_resource(Register, '/register')
api.add_resource(RefreshToken, '/refresh-token')
api.add_resource(UserProfile, '/profile')