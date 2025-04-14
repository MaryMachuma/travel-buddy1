from app import app,db
from models import Destination

# Sample data
destinations_data = [
    {
        "id": 1,
        "name": "Eiffel Tower",
        "city": "Paris",
        "country": "France",
        "description": "The Eiffel Tower is the most iconic monument in Paris as it enchantingly adds elegance to the city skyline",
        "image": "https://i.imgur.com/7E3dyCA.jpg",
        "price": 400000,
        "rating": 4.8
    },
    
    {
        "id": 3,
        "name": "The Great Wall of China",
        "city": "Beijing",
        "country": "China",
        "description": "A captivating historical monument.It is a magical site and one of the 8 wonders of the world",
        "image": "https://i.imgur.com/kb51UTd.jpg",
        "price": 70000,
        "rating": 4.5
    },
    {
        "id": 4,
        "name": "Watamu",
        "city": "Mombasa",
        "country": "Kenya",
        "description": "Coastal village with white-sand beaches and vibrant marine life.",
        "image": "https://i.imgur.com/zxiEde2.jpg",
        "price": 65000,
        "rating": 4.6
    },
    {
        "id": 5,
        "name": "Maldives Island",
        "city": "Maldives",
        "country": "Maldives",
        "description": "Tropical paradise in the Indian Ocean renowned for its stunning coral atolls, crystal-clear lagoons, and diverse marine life.",
        "image": "https://i.imgur.com/HLcA5TV.jpg",
        "price": 400000,
        "rating": 5.0
    }
]

with app.app_context():
    # Clear existing destinations
    Destination.query.delete()

    # Add new destinations
    for data in destinations_data:
        destination = Destination(
            id=data["id"],
            name=data["name"],
            city=data["city"],
            country=data["country"],
            description=data["description"],
            image=data["image"],
            price=data["price"],
            rating=data["rating"]
        )
        db.session.add(destination)

    db.session.commit()
    print("✅ Destinations seeded successfully.")
