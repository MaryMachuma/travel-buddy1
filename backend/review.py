from extensions import db
from sqlalchemy.orm import relationship
from sqlalchemy_serializer import SerializerMixin

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    
    # Define relationships
    user = relationship("User", back_populates="reviews")
    destination = relationship("Destination", back_populates="reviews")
    
    # Serialization rules
    serialize_rules = ('-user.reviews', '-destination.reviews')

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "destination_id": self.destination_id,
            "rating": self.rating,
            "comment": self.comment
        } 


