import React, { useState } from 'react';
import { useTrips } from './TripsContext';
import BookingForm from './BookingForm';
import Reviews from './Reviews';

const PersonalTrips = () => {
  const { personalTrips, addToTrips,  updateTrip } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripToReview, setTripToReview] = useState(null);

  const handleCancelTrip = (tripId, reason) => {
    updateTrip(tripId, { 
      status: 'Cancelled',
      cancellationReason: reason 
    });
    setCancellationReason('');
  };

  const handleSubmitReview = (reviewData) => {
    updateTrip(tripToReview.id, { 
      review: reviewData,
      reviewedAt: new Date().toISOString() 
    });
    setTripToReview(null);
  };

  return (
    <div className="personal-trips-section">
      <h2>My Trips</h2>
      
      {personalTrips.length === 0 ? (
        <p className="empty-message">No trips booked yet. Add some destinations!</p>
      ) : (
        <div className="trips-grid">
          {personalTrips.map(trip => (
            <div key={`${trip.id}-${trip.status}`} className={`trip-card ${trip.status?.toLowerCase()}`}>
              <img 
                src={trip.image} 
                alt={trip.name}
                className="trip-image"
              />
              
              <div className="trip-info">
                <h3>{trip.name}</h3>
                <p>{trip.city}</p>
                
                {trip.startDate && (
                  <p className="trip-dates">
                    📅 {new Date(trip.startDate).toLocaleDateString()} - 
                    {trip.endDate && new Date(trip.endDate).toLocaleDateString()}
                  </p>
                )}
                
                <div className="trip-status">
                  <span className={`status-badge ${trip.status?.toLowerCase()}`}>
                    {trip.status || 'Pending'}
                  </span>
                  {trip.status === 'Cancelled' && trip.cancellationReason && (
                    <p className="cancellation-reason">
        
                    </p>
                  )}
                </div>

                {trip.review && (
                  <div className="trip-review">
                    <div className="review-rating">
                      {'⭐'.repeat(trip.review.rating)}
                    </div>
                    <p>{trip.review.comment}</p>
                  </div>
                )}
              </div>

              <div className="trip-actions">
                {!trip.startDate ? (
                  <button
                    onClick={() => setSelectedTrip(trip)}
                    className="btn btn-primary"
                  >
                    Book Dates
                  </button>
                ) : trip.status !== 'Cancelled' && (
                  <button
                    onClick={() => {
                      const reason = prompt('Cancellation reason:');
                      if (reason) handleCancelTrip(trip.id, reason);
                    }}
                    className="btn btn-danger"
                  >
                    Cancel
                  </button>
                )}

                {trip.startDate && !trip.review && (
                  <button
                    onClick={() => setTripToReview(trip)}
                    className="btn btn-secondary"
                  >
                    Write Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Date Modal */}
      {selectedTrip && (
        <BookingForm
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onSubmit={(dates) => {
            updateTrip(selectedTrip.id, {
              startDate: dates.startDate,
              endDate: dates.endDate,
              status: 'Booked'
            });
            setSelectedTrip(null);
          }}
        />
      )}

      {/* Review Modal */}
      {tripToReview && (
        <Reviews
          destination={tripToReview}
          onClose={() => setTripToReview(null)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
};

export default PersonalTrips;



                  