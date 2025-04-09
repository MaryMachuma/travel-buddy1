from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from datetime import datetime
import re
from extensions import db

class Destination(db.Model, SerializerMixin):
    __tablename__ = "destinations"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float)
    image_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    trips = db.relationship('Trip', back_populates='destination', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='destination', cascade='all, delete-orphan')
    
    #Association proxy
    users = association_proxy('trips', 'user')
    
    #Serialization config
    serialize_rules = ('-trips.destination', '-reviews.destination')