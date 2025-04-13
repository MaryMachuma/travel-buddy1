import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
        handleSearch(inputValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSearch = async (searchTerm) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/destinations?city_like=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setOptions(
        data.map(dest => ({
          value: dest.id,
          label: `${dest.name}, ${dest.city}`,
          ...dest
        }))
      );
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      onSearch(selectedOption);
      setInputValue(''); // 🔥 Reset search input after selecting
    }
  };

  return (
    <div className="search-bar">
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={options}
        onInputChange={(newValue) => setInputValue(newValue)}
        inputValue={inputValue} // 🔥 Controlled input
        onChange={handleChange}
        isLoading={isLoading}
        placeholder="Search destinations by city e.g Paris, Maldives, Mombasa"
      />
    </div>
  );
};

export default SearchBar;
