// src/components/DestinationCard.jsx
import React from 'react';

const DestinationCard = ({ destination, onClick }) => {
  return (
    <div className="destination-card" onClick={() => onClick(destination)}>
      <img 
        src={destination.image} 
        alt={destination.name}
        className="destination-image"
      />
      <div className="destination-info">
        <h3>{destination.name}</h3>
        <p className="destination-city">{destination.city}</p>
        <div className="destination-meta">
          <span className="destination-price">${destination.price}</span>
          <span className="destination-rating">
            ★ {destination.rating}/5
          </span>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;