from flask import Flask, request
from flask_restful import Api, Resource 
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate , upgrade
from models import User, Destination, Trip , db
from datetime import datetime
from flask_cors import CORS  
import os
# App Configuration
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev-secret-key'
app.config['JWT_SECRET_KEY'] = 'dev-jwt-secret-key'

db.init_app(app)

CORS(app, resources={r"/*": {"origins": "https://travel-buddy-frontend-c7mp.onrender.com"}})
migrate = Migrate(app, db)
api = Api(app)
jwt = JWTManager(app)

@jwt.user_identity_loader
def user_identity_lookup(user_id):
    return str(user_id)
    
   # creating migration and seeding on deployment to render 
#def init_db():
  #  try:
        # Run migrations
      #  upgrade()

        # Seed the database
      #  seed_file_path = os.path.join(os.path.dirname(__file__), 'seed.py')
      #  with open(seed_file_path) as f:
        #    exec(f.read())  # Run your seed.py content directly

      #  print("DB migrated and seeded successfully.")

 #   except Exception as e:
  #      print(f"Error during migration or seeding: {e}")

# with app.app_context():
   # init_db()

# User Registration
class UserResource(Resource):
    def post(self):
        if not request.is_json:
            return {"message": "Request must be JSON"}, 400

        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')  # Include phone number here

        if not name or not email or not password or not phone:
            return {"message": "Name, email, password, and phone are required"}, 400

        if User.query.filter_by(email=email).first():
            return {"message": "User already exists!"}, 400

        try:
            hashed_password = generate_password_hash(password)
            new_user = User(name=name, email=email, password=hashed_password, phone=phone)
            db.session.add(new_user)
            db.session.commit()
            return {"message": "User registered successfully!"}, 201
        except Exception as e:
            return {"message": "Registration failed", "error": str(e)}, 500

# User Login
class LoginResource(Resource):
    def post(self):
        if not request.is_json:
            return {"message": "Request must be JSON"}, 400

        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id)

            return {"access_token": access_token}

        return {"message": "Invalid credentials"}, 401

# Get Destinations
class DestinationsResource(Resource):
    def get(self):
        city_like = request.args.get('city_like', "").strip()

        if city_like:
            destinations = Destination.query.filter(Destination.city.ilike(f"%{city_like}%")).all()
        else:
            destinations = Destination.query.all()

        return [{
            "id": d.id,
            "name": d.name,
            "city": d.city,
            "country": d.country,
            "description": d.description,
            "image": d.image,
            "price": d.price,
            "rating": d.rating
        } for d in destinations]

# Submit Trip


class TripResource(Resource):
    @jwt_required()
    def post(self):
        if not request.is_json:
            return {"message": "Request must be JSON"}, 400

        user_id = get_jwt_identity()
        user_id = int(user_id)

        data = request.get_json()

        # Validate required fields
        required_fields = ['destinationId', 'startDate', 'endDate']
        if not all(field in data for field in required_fields):
            return {"message": f"Missing required fields: {', '.join(required_fields)}"}, 400

        try:
            # Convert and validate dates
            start_date = datetime.strptime(data['startDate'], '%Y-%m-%d').date()
            end_date = datetime.strptime(data['endDate'], '%Y-%m-%d').date()
            
            if end_date <= start_date:
                return {"message": "End date must be after start date"}, 400
                
        except ValueError:
            return {"message": "Invalid date format. Use YYYY-MM-DD"}, 400

        # Check destination exists
        destination = Destination.query.get(data['destinationId'])
        if not destination:
            return {"message": "Destination not found"}, 404

        # Check for existing booking (optional)
        existing_trip = Trip.query.filter_by(
            user_id=user_id,
            destination_id=destination.id
        ).first()
        
        if existing_trip:
            return {
                "message": "You already have a trip booked to this destination",
                "existingTripId": existing_trip.id
            }, 409  # 409 Conflict

        # Create new trip
        try:
            new_trip = Trip(
                user_id=user_id,
                destination_id=destination.id,
                startDate=start_date,
                endDate=end_date
            )
            db.session.add(new_trip)
            db.session.commit()
            
            return {
                "message": "Trip booked successfully",
                "tripId": new_trip.id,
                "destination": destination.name
            }, 201
            
        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Trip booking failed: {str(e)}")
            return {
                "message": "Failed to book trip",
                "error": str(e)
            }, 500
class SeedResource(Resource):
    def post(self):
        try:
            # Get data from the request body (expecting JSON)
            destinations_data = request.get_json()

            # Check if data is provided
            if not destinations_data:
                return {"error": "No data provided"}, 400

            # Clear the existing data in the Destination table
            Destination.query.delete()

            # Seed new data
            for data in destinations_data:
                destination = Destination(
                    id=data.get("id"),
                    name=data.get("name"),
                    city=data.get("city"),
                    country=data.get("country"),
                    description=data.get("description"),
                    image=data.get("image"),
                    price=data.get("price"),
                    rating=data.get("rating")
                )
                db.session.add(destination)

            db.session.commit()
            return {"message": "Destinations table seeded successfully"}, 201

        except Exception as e:
            return {"error": str(e)}, 500

# API Routes
api.add_resource(UserResource, '/register')
api.add_resource(LoginResource, '/login')
api.add_resource(DestinationsResource, '/destinations')
api.add_resource(TripResource, '/trips')
api.add_resource(SeedResource, '/seed')


