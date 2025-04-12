import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PersonalTrips = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState('');
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/destinations')
      .then(res => res.json())
      .then(data => {
        setDestinations(data);
        if (data.length > 0) {
          setSelectedDestinationId(data[0].id.toString());
        }
      })
      .catch(err => {
        alert('Failed to load destinations.');
        console.error('Error fetching destinations:', err);
      })
      .finally(() => setIsLoadingDestinations(false));
  }, []);

  const handleDestinationChange = (e) => {
    setSelectedDestinationId(e.target.value);
  };

  const handleSelectDuration = () => {
    const selected = destinations.find(dest => dest.id.toString() === selectedDestinationId);
    if (selected) {
      const currentUser = JSON.parse(localStorage.getItem('user')); // Retrieve current user
      navigate('/booking', { 
        state: { destination: selected, userId: currentUser.id } // Pass userId along with destination
      });
    }
  };

  return (
    <div className="personal-trips-section">
      <h2>My Trip</h2>
      <h3>Browse images and details of destinations on HomePage before selecting your desired trip.</h3>
      <div className="destination-selection-card">
        {isLoadingDestinations ? (
          <p>Loading destinations...</p>
        ) : destinations.length === 0 ? (
          <p>No destinations available for booking</p>
        ) : (
          <div>
            <div className="form-group">
              <label>Select Destination:</label>
              <select 
                value={selectedDestinationId} 
                onChange={handleDestinationChange}
              >
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name}, {dest.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" onClick={handleSelectDuration}>
                Select Duration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalTrips;

