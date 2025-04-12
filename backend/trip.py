from datetime import date
from extensions import db


class Trip(db.Model):
    __tablename__ = 'trips'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id')) 
    destination_id = db.Column(db.Integer, db.ForeignKey('destinations.id'))  
    start_date = db.Column(db.Date)
    budget = db.Column(db.Float)
    note = db.Column(db.Text)
    
    # Define relationships
    user = db.relationship("User", back_populates="trips")
    destination = db.relationship("Destination", back_populates="trips")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "destination_id": self.destination_id,
            "budget":self.budget,
            "note": self.note
        }