
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const destination = location.state?.destination;
  const userId = location.state?.userId;  // Retrieve userId from location.state

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔁 Safe redirect after mount
  useEffect(() => {
    if (!destination) {
      navigate('/');  // Redirect to home if destination is not found
    }
  }, [destination, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    const newTrip = {
      userId,  // Include userId in the new trip data
      destinationId: destination.id,
      destinationName: destination.name,
      destinationCity: destination.city,
      startDate,
      endDate,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch('http://localhost:3000/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTrip),
      });

      if (response.ok) {
        alert('Trip booked successfully!');
        navigate('/personal-trips');
      } else {
        throw new Error('Failed to book trip.');
      }
    } catch (error) {
      alert(error.message);
      console.error('Error posting trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!destination) return null; // 🔒 prevent rendering form before redirect

  return (
    <div className="booking-container">
      <h2>Book Your Trip to {destination.name}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Book Trip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Booking;


