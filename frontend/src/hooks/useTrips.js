// src/hooks/useTrips.js
import { useState } from 'react';

export const useTrips = () => {
  const [trips, setTrips] = useState([]);

  const addTrip = (trip) => {
    setTrips([...trips, { ...trip, id: Date.now(), status: 'pending' }]);
  };

  return {
    trips,
    addTrip,
  };
};