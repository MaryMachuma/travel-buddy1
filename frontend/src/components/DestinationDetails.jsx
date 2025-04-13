import React from 'react';

const DestinationDetails = ({ destination, onClose }) => {
  return (
    <div className="destination-details-overlay">
      <div className="destination-details">
        <button className="close-btn" onClick={onClose}>Close</button>
        <img src={destination.image} alt={destination.name} />
        <h2>{destination.name}</h2>
        <p><strong>Location:</strong> {destination.city},{destination.country}</p>
        <p><strong>Price:</strong> ${destination.price}</p>
        <p><strong>Rating:</strong> {destination.rating}/5</p>
        <p><strong>Description:</strong> {destination.description}</p>
      </div>
    </div>
  );
};

export default DestinationDetails; 
