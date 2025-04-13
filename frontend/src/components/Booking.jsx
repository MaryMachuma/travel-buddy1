import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [destinationData, setDestinationData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    people: 1,
    days: 5,
  });

  useEffect(() => {
    if (location.state && location.state.destination) {
      setDestinationData(location.state.destination);
      setUserId(location.state.userId);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingData = {
      ...formData,
      destinationId: destinationData?.id,
      destinationName: destinationData?.name,
      destinationCity: destinationData?.city,
      userId: userId,
    };

    try {
      const response = await fetch('http://localhost:3000/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        throw new Error('Failed to book trip.');
      }
    } catch (error) {
      alert(error.message);
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!destinationData && !formSubmitted) {
    return (
      <div className="booking-error">
        <h2>No Destination Selected</h2>
        <p>Please select a destination before booking a trip.</p>
        <button onClick={() => navigate('/destinations')} className="btn-primary">
          Go to Destinations
        </button>
      </div>
    );
  }

  if (formSubmitted) {
    return (
      <div className="booking-success">
        <h2>Booking Confirmed!</h2>
        <p>Thank you for booking your trip to {destinationData?.name}!</p>
        <p>We've sent a confirmation email to {formData.email}.</p>
        <ul>
          <li>Destination: {destinationData?.name}, {destinationData?.city}</li>
          <li>Number of people: {formData.people}</li>
          <li>Duration: {formData.days} days</li>
        </ul>
        <button onClick={() => navigate('/trips')} className="btn-primary">
          View My Trips
        </button>
      </div>
    );
  }

  if (destinationData && !showForm) {
    return (
      <div className="booking-container">
        <h2>Book Your Trip to {destinationData.name}</h2>
        <div className="destination-summary">
          <h3>{destinationData.name}, {destinationData.city}</h3>
          {destinationData.image && (
            <img
              src={destinationData.image}
              alt={destinationData.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
              }}
            />
          )}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Book Your Trip
        </button>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <h2>Book Your Trip {destinationData && `to ${destinationData.name}`}</h2>
      {destinationData && (
        <div className="destination-summary">
          <h3>{destinationData.name}, {destinationData.city}</h3>
          {destinationData.image && (
            <img
              src={destinationData.image}
              alt={destinationData.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
              }}
            />
          )}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">Number of People:</label>
          <input
            type="number"
            id="people"
            name="people"
            min="1"
            value={formData.people}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="days">Number of Days:</label>
          <input
            type="number"
            id="days"
            name="days"
            min="1"
            value={formData.days}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default Booking;
