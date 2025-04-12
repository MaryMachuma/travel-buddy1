import { createContext, useContext, useState, useEffect } from 'react';

const TripsContext = createContext();

export function TripsProvider({ children }) {
  const [personalTrips, setPersonalTrips] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('travelBuddyTrips');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('travelBuddyTrips', JSON.stringify(personalTrips));
  }, [personalTrips]);

  const addToTrips = (destination) => {
    setPersonalTrips(prev => {
      // Check for existing trip by ID and name for certainty
      const exists = prev.some(trip => 
        trip.id === destination.id && trip.name === destination.name
      );
      return exists ? prev : [...prev, destination];
    });
  };

  return (
    <TripsContext.Provider value={{ 
      personalTrips,
      addToTrips,
      tripsCount: personalTrips.length // Additional helpful value
    }}>
      {children}
    </TripsContext.Provider>
  );
}

export const useTrips = () => useContext(TripsContext);