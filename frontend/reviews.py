from extensions import db
from sqlalchemy.orm import validates

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False)

    user = db.relationship('User', backref='reviews')
    destination = db.relationship('Destination', backref='reviews')

    @validates('rating')
    def validate_rating(self, key, rating):
        if rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5")
        return rating

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "rating": self.rating,
            "user_id": self.user_id,
            "destination_id": self.destination_id,
            "user": self.user.username if self.user else None,
            "destination": self.destination.name if self.destination else None,
        }