import React, { useState } from 'react';
import SearchBar from './SearchBar';
import DestinationDetails from './DestinationDetails';
import DestinationCard from './DestinationCard';
import { searchDestinations } from './Apis';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const handleSearchResult = (destination) => {
    if (destination) {
      // When a search result is selected, show the details of the destination
      setSelectedDestination(destination);
      setDestinations([destination]); 
    }
  };

  const handleManualSearch = async (city) => {
    try {
      // When searching manually, clear any selected destination and show search results
      const results = await searchDestinations(city);
      setDestinations(results);
      setSelectedDestination(null); 
    } catch (error) {
      console.error('Search failed:', error);
      setDestinations([]); 
    }
  };

  return (
    <div className="destinations-container">
      <h2>Find Your Next Adventure</h2>

      {/* Search bar with destination search functionality */}
      <SearchBar onSearch={handleSearchResult} onManualSearch={handleManualSearch} />

      {/* Display destination details when a destination is selected */}
      {selectedDestination && (
        <div className="destination-details-container">
          <DestinationDetails
            destination={selectedDestination}
            onClose={() => setSelectedDestination(null)} // Close the destination details
          />
        </div>
      )}

      {/* Display destinations grid when no destination is selected */}
      {!selectedDestination && destinations.length > 0 && (
        <div className="destinations-grid">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onClick={() => setSelectedDestination(destination)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Destinations;
