from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from datetime import datetime
import re
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    _password_hash = db.Column(db.String(255), nullable=False)  # Store hashed password
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    #trips = db.relationship('Trip', back_populates='user', cascade='all, delete-orphan')
    #destinations = association_proxy('trips', 'destination')
    
    # Serialization rules
    serialize_rules = ('-_password_hash', '-trips.user')
    
    @validates('username')
    def validate_username(self, key, username):
        if not username or len(username) < 3:
            raise ValueError("Username must be at least 3 characters long")
        return username
    
    @validates('email')
    def validate_email(self, key, email):
        if not email:
            raise ValueError("Email cannot be empty")
        
        # Basic email validation using regex
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            raise ValueError("Invalid email format")
        
        return email
    
    # Property and setter for password to handle hashing
    @property
    def password(self):
        raise AttributeError("Password is write-only")
    
    @password.setter
    def password(self, password):
        if not password or len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")
        self._password_hash = generate_password_hash(password)
    
    # Method to check password
    def check_password(self, password):
        return check_password_hash(self._password_hash, password)