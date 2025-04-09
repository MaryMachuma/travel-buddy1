from datetime import date
from extensions import db



class Trip(db.Model):
    __tablename__ = 'trips'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    destination_id = db.Column(db.Integer, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    budget = db.Column(db.Float, nullable=False)
    note = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "destination_id": self.destination_id,
            "start_date": self.start_date.isoformat(),
            "budget": self.budget,
            "note": self.note
        }