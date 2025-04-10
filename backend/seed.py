# seed.py

from app import app, db
from trip import Trip
from review import Review
from datetime import date
from user import User
from destination import Destination


with app.app_context():
    # Clear existing data
    print("Clearing existing data...")
    Trip.query.delete()
    Review.query.delete()
    Destination.query.delete()
    User.query.delete()
    db.session.commit()
    
    print("Creating sample destinations...")
    # Create destinations
    destinations = [
        Destination(
            name="Paris",
            category="International",
            description="The City of Light, known for the Eiffel Tower, Louvre Museum, and fine cuisine.",
            image_url="https://www.pinterest.com/pin/12314598975825458/",
            price=400000
        ),
        Destination(
            name="Bali",
            category="International",
            description="A beautiful Indonesian island known for beaches, coral reefs, and volcanic mountains.",
            image_url="https://www.pinterest.com/pin/774124928413958/",
            price=260000
        ),
        Destination(
            name="Lamu",
            category="Domestic",
            description="A captivating island town in Kenya, known for its well-preserved Swahili architecture, narrow winding streets, and rich cultural heritage.",
            image_url="https://www.pinterest.com/pin/54324739250462673/",
            price=70000
        ),
        Destination(
            name="Watamu",
            category="Domestic",
            description="A coastal village on Kenya's central coast, known for its beautiful white-sand beaches, vibrant marine life, and a relaxed, eco-tourist-friendly atmosphere.",
            image_url="https://www.pinterest.com/pin/71353975342141593/",
            price=65000
        ),
        Destination(
            name="Greece",
            category="International",
            description="A country renowned for its stunning landscapes and vibrant culture, encompassing ancient ruins, beautiful islands, and delicious cuisine.",
            image_url="https://www.pinterest.com/pin/633387443395009/",
            price=350000
        ),
        Destination(
            name="Santorini",
            category="International",
            description="A Greek island known for its white-washed buildings and stunning sunsets.",
            image_url="https://www.pinterest.com/pin/2744449768853266/",
            price=450000
        ),
        Destination(
            name="Mauritius",
            category="Beach",
            description="Captivating island nation in the Indian Ocean, known for its stunning natural beauty, boasting pristine beaches and lush landscapes.",
            image_url="https://www.pinterest.com/pin/703756187874821/",
            price=400000
        ),
        Destination(
            name="Zanzibar",
            category="Beach",
            description="Island full of culture and history, shining white-sand beaches with palms swaying lazily in the sea breeze.",
            image_url="https://www.pinterest.com/pin/2322237302015186/",
            price=100000
        ),
        Destination(
            name="Diani",
            category="Beach",
            description="Tropical paradise with silky white sands, warm turquoise waters and palm-lined streets.",
            image_url="https://www.pinterest.com/pin/29203097579029469/",
            price=50000
        ),
        Destination(
            name="Maldives",
            category="International",
            description="Tropical paradise in the Indian Ocean renowned for its stunning coral atolls, crystal-clear lagoons, and diverse marine life.",
            image_url="https://www.pinterest.com/pin/1759287347989332/",
            price=400000
        ),
    ]
    
    # Add all destinations to the session
    db.session.add_all(destinations)
    db.session.commit()
    
    print("Creating sample users...")
    # Create users
    users = [
        User(
            username="traveler1",
            email="traveler1@example.com",
            password="password123"  # In production, use password hashing
        ),
        User(
            username="adventurer",
            email="adventurer@example.com",
            password="secure456"  # In production, use password hashing
        ),
        # Add more users as needed
    ]
    
    # Add all users to the session
    db.session.add_all(users)
    db.session.commit()
    
    # Verify data was added
    destination_count = Destination.query.count()
    user_count = User.query.count()
    
    trip1 = Trip(
        user_id=1,
        destination_id=1,
        start_date=date(2025, 6, 1),
        budget=1000.0,
        note="Excited for this adventure!"
    )

    trip2 = Trip(
        user_id=2,
        destination_id=2,
        start_date=date(2025, 7, 15),
        budget=1500.0,
        note="Beach vibes incoming 🌴"
    )

    
    review1 = Review(
        user_id=1,
        destination_id=1,
        rating=5,
        comment="Absolutely loved this place!"
    )

    review2 = Review(
        user_id=2,
        destination_id=2,
        rating=4,
        comment="Great location but the hotel could be better."
    )

    # Add to session and commit
    db.session.add_all([trip1, trip2, review1, review2])
    db.session.commit()

    print("🌱 Database seeded successfully!")