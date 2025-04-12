import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Destination = ({ user }) => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/destinations')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch destinations');
        return response.json();
      })
      .then((data) => {
        setDestinations(data);
        setFilteredDestinations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = destinations.filter((destination) =>
      destination.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDestinations(filtered);
  }, [search, destinations]);

  const handleBookTrip = (destinationId) => {
    if (!user) {
      setError('Please log in to book a trip');
      navigate('/');
      return;
    }
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Authentication token missing');
      navigate('/');
      return;
    }
    const tripData = {
      user_id: user.id,
      destination_id: destinationId,
      start_date: new Date().toISOString().split('T')[0],
      budget: 1000.0,
      note: 'Booked from Destination page',
    };
    fetch('/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(tripData),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to book trip');
        return response.json();
      })
      .then(() => {
        alert('Trip booked successfully!');
        navigate('/my-trips');
      })
      .catch((err) => setError(err.message));
  };

  if (loading) return <div>Loading destinations...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="destination-container">
      <h1>Explore Destinations</h1>
      <input
        type="text"
        placeholder="Search destinations by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      {filteredDestinations.length === 0 ? (
        <p>No destinations found.</p>
      ) : (
        <ul className="destination-list">
          {filteredDestinations.map((destination) => (
            <li key={destination.id} className="destination-item">
              <img src={destination.image_url} alt={destination.name} className="destination-image" />
              <div className="destination-details">
                <h2>{destination.name}</h2>
                <p>{destination.description}</p>
                <button
                  onClick={() => handleBookTrip(destination.id)}
                  className="book-btn"
                >
                  Book a Trip
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Destination;