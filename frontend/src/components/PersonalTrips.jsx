import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PersonalTrips = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    fetch('http://localhost:5000/destinations', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch destinations');
        }
        return res.json();
      })
      .then(data => {
        setDestinations(data);
        if (data.length > 0) {
          setSelectedDestinationId(data[0].id.toString()); // Store as string for the select element
        }
      })
      .catch(err => {
        console.error('Error fetching destinations:', err);
        alert('Failed to load destinations. Please try again.');
      })
      .finally(() => setIsLoadingDestinations(false));
  }, []);

  const handleDestinationChange = (e) => {
    setSelectedDestinationId(e.target.value);
  };

  const formatDateToISO = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book a trip.');
      navigate('/login');
      return;
    }
  
    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:5000/trips', {
        method: 'POST',
        headers: {
           "Content-Type":  "application/json",
           "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          destinationId: Number(selectedDestinationId),
          startDate: startDate,  // Already formatted from date input
          endDate: endDate
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400) {
          throw new Error(result.message || 'Invalid trip data');
        } else if (response.status === 404) {
          throw new Error('Destination not found');
        } else if (response.status === 409) {
          throw new Error(result.message || 'You already booked this destination');
        } else {
          throw new Error(result.message || 'Booking failed');
        }
      }
  
      // Success case
      alert(`Success! ${result.message} to ${result.destination}`);
      navigate('/trips');
      
    } catch (error) {
      alert(`Booking error: ${error.message}`);
      console.error('Booking failed:', error);
    } finally {
      setIsSubmitting(false);
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
          <p id="yuh">Cannot fetch data</p>
        ) : (
          <div>
            <div className="form-group">
              <label>Select Destination:</label>
              <select 
                value={selectedDestinationId} 
                onChange={handleDestinationChange}
              >
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.id.toString()}>
                    {dest.name}, {dest.city}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleSubmit} 
                disabled={isSubmitting || !selectedDestinationId}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalTrips;
