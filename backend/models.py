from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password = db.Column(db.Text, nullable=False)

    
    # Relationship to Trip
    trips = relationship('Trip', back_populates='user', cascade='all, delete-orphan')


   
class Destination(db.Model, SerializerMixin):
    __tablename__ = 'destinations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.Text,nullable=False)
    price = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Float, nullable=False)
    
    # Relationship to Trip
    trips = relationship('Trip', back_populates='destination')


class Trip(db.Model, SerializerMixin):
    __tablename__ = 'trips'
    
    id = db.Column(db.Integer, primary_key=True)
    startDate = db.Column(db.Date, nullable=False)
    endDate = db.Column(db.Date, nullable=False)

    # Foreign keys
    destination_id = db.Column(db.Integer, ForeignKey('destinations.id'), nullable=False)
    user_id = db.Column(db.Integer, ForeignKey('users.id'), nullable=True)
    
    # Relationship to User and Destination
    user = relationship('User', back_populates='trips')
    destination = relationship('Destination', back_populates='trips')

