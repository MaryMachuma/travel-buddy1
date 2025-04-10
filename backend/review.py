from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from flask_marshmallow import Marshmallow

# Initialize Flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travel_app.db'  # Use SQLite for simplicity; adjust as needed
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)

# Model definitions
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    reviews = relationship("Review", back_populates="user")

    def __repr__(self):
        return f'<User {self.username}>'

class Destination(db.Model):
    __tablename__ = 'destinations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))
    image = db.Column(db.String(150))
    category = db.Column(db.String(50))
    reviews = relationship("Review", back_populates="destination")

    def __repr__(self):
        return f'<Destination {self.name}>'

class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="reviews")
    destination = relationship("Destination", back_populates="reviews")

    def __repr__(self):
        return f'<Review {self.content[:20]}...>'

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "rating": self.rating,
            "comment": self.comment,
            "user_id": self.user_id,
            "destination_id": self.destination_id,
            "created_at": self.created_at.isoformat()
        }

# Schema definitions for serialization
class ReviewSchema(ma.Schema):
    class Meta:
        fields = ('id', 'content', 'rating', 'comment', 'user_id', 'destination_id', 'created_at')

review_schema = ReviewSchema()
reviews_schema = ReviewSchema(many=True)

# API resources
class ReviewResource(Resource):
    def get(self, review_id):
        review = Review.query.get_or_404(review_id)
        return review_schema.dump(review)

    def put(self, review_id):
        review = Review.query.get_or_404(review_id)
        if 'content' in request.json:
            review.content = request.json['content']
        if 'rating' in request.json:
            review.rating = request.json['rating']
        if 'comment' in request.json:
            review.comment = request.json['comment']

        db.session.commit()
        return review_schema.dump(review)

    def delete(self, review_id):
        review = Review.query.get_or_404(review_id)
        db.session.delete(review)
        db.session.commit()
        return '', 204

class ReviewListResource(Resource):
    def get(self):
        reviews = Review.query.all()
        return reviews_schema.dump(reviews)

    def post(self):
        try:
            new_review = Review(
                content=request.json['content'],
                rating=request.json['rating'],
                comment=request.json.get('comment'),
                user_id=request.json['user_id'],
                destination_id=request.json['destination_id']
            )
            db.session.add(new_review)
            db.session.commit()
            return review_schema.dump(new_review), 201
        except KeyError as e:
            return {"error": f"Missing required field: {str(e)}"}, 400

# API resource routing
api.add_resource(ReviewListResource, '/reviews')
api.add_resource(ReviewResource, '/reviews/<int:review_id>')

# Run the application
if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database tables
    app.run(debug=True)