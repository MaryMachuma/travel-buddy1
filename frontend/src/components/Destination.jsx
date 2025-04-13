import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Destination = ({ user }) => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Sample data as fallback
  const sampleDestinations = [
    {
      id: 1,
      name: 'Beach Paradise',
      description: 'Beautiful beaches and clear blue waters',
      image_url: 'https://via.placeholder.com/300x200?text=Beach+Paradise',
      city: 'Tropicana'
    },
    {
      id: 2,
      name: 'Mountain Retreat',
      description: 'Peaceful mountain getaway with stunning views',
      image_url: 'https://via.placeholder.com/300x200?text=Mountain+Retreat',
      city: 'Alpine Valley'
    },
    {
      id: 3,
      name: 'City Explorer',
      description: 'Urban adventure in the heart of downtown',
      image_url: 'https://via.placeholder.com/300x200?text=City+Explorer',
      city: 'Metropolis'
    }
  ];

  useEffect(() => {
    console.log('Fetching destinations...');
    
    
    fetch('http://localhost:3000/destinations')
      .then((response) => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch destinations: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Destinations data received:', data);
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
          setFilteredDestinations(data);
        } else {
          console.warn('Empty or invalid data received, using sample data');
          setDestinations(sampleDestinations);
          setFilteredDestinations(sampleDestinations);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching destinations:', err);
        setError(err.message);
        console.log('Using sample destinations as fallback');
        setDestinations(sampleDestinations);
        setFilteredDestinations(sampleDestinations);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = destinations.filter((destination) =>
      destination.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredDestinations(filtered);
  }, [search, destinations]);

  const handleBookTrip = (destination) => {
    console.log('Book Trip button clicked for destination:', destination);

    // No user check to simplify for testing
    const destinationData = {
      id: destination.id,
      name: destination.name,
      city: destination.city || '',
      image: destination.image_url || ''
    };
    
    navigate('/booking', {
      state: { 
        destination: destinationData,
        userId: user?.id || 'guest' 
      }
    });
  };

  // Show loading indicator
  if (loading) {
    return (
      <div className="loading-container">
        <h2>Loading destinations...</h2>
        <p>Please wait while we fetch amazing places for you to visit.</p>
      </div>
    );
  }

  // Show error with sample data option
  if (error && destinations.length === 0) {
    return (
      <div className="error-container">
        <h2>Error Loading Destinations</h2>
        <p>{error}</p>
        <p>Check your network connection or server status.</p>
        <button 
          onClick={() => {
            setDestinations(sampleDestinations);
            setFilteredDestinations(sampleDestinations);
            setError(null);
          }}
          className="btn-primary"
        >
          Use Sample Destinations
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="btn-secondary"
        >
          Retry
        </button>
      </div>
    );
  }

  // The main component view
  return (
    <div className="destination-container">
      <h1>Explore Destinations</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search destinations by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>
      
      {error && (
        <div className="error-banner">
          Note: Using sample data. {error}
        </div>
      )}
      
      {filteredDestinations.length === 0 ? (
        <div className="no-results">
          <p>No destinations found matching your search.</p>
          <button 
            onClick={() => setSearch('')}
            className="btn-secondary"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <ul className="destination-list">
          {filteredDestinations.map((destination) => (
            <li key={destination.id} className="destination-item">
              <img 
                src={destination.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
                alt={destination.name} 
                className="destination-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                }}
              />
              <div className="destination-details">
                <h2>{destination.name}</h2>
                <p>{destination.description || 'Explore this wonderful destination!'}</p>
                {destination.city && <p className="destination-city">Location: {destination.city}</p>}
                <button
                  onClick={() => handleBookTrip(destination)}
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