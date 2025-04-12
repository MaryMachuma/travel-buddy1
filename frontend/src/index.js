// index.js - Main entry point for Travel Buddy application

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    console.log('Travel Buddy Application Initialized');
    
    // Fetch destinations from the backend
    fetchDestinations();
    
    // Set up event listeners
    setupEventListeners();
  });
  
  // Fetch destinations from the API
  function fetchDestinations() {
    fetch('http://localhost:5000/destinations')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(destinations => {
        console.log('Destinations loaded:', destinations);
        displayDestinations(destinations);
      })
      .catch(error => {
        console.error('Error fetching destinations:', error);
        displayError('Failed to load destinations. Please try again later.');
      });
  }
  
  // Display destinations in the UI
  function displayDestinations(destinations) {
    const destinationContainer = document.getElementById('destination-container');
    if (!destinationContainer) {
      console.error('Destination container not found in the DOM');
      return;
    }
    
    destinationContainer.innerHTML = '';
    
    destinations.forEach(destination => {
      const card = createDestinationCard(destination);
      destinationContainer.appendChild(card);
    });
  }
  
  // Create a card element for a destination
  function createDestinationCard(destination) {
    const card = document.createElement('div');
    card.className = 'destination-card';
    card.dataset.id = destination.id;
    
    card.innerHTML = `
      <h3>${destination.name}</h3>
      <p>${destination.location}</p>
      <p class="description">${destination.description}</p>
      <div class="rating">Rating: ${calculateAverageRating(destination.reviews)}</div>
      <button class="view-details-btn">View Details</button>
    `;
    
    return card;
  }
  
  // Calculate the average rating from reviews
  function calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) {
      return 'No ratings yet';
    }
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1) + ' / 5';
  }
  
  // Display error message
  function displayError(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.textContent = message;
      errorContainer.style.display = 'block';
      
      // Hide after 5 seconds
      setTimeout(() => {
        errorContainer.style.display = 'none';
      }, 5000);
    }
  }
  
  // Set up event listeners
  function setupEventListeners() {
    const container = document.getElementById('destination-container');
    if (container) {
      container.addEventListener('click', event => {
        // Handle view details button clicks
        if (event.target.classList.contains('view-details-btn')) {
          const card = event.target.closest('.destination-card');
          if (card) {
            const destinationId = card.dataset.id;
            viewDestinationDetails(destinationId);
          }
        }
      });
    }
    
    // Add search functionality
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', event => {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchDestinations(searchInput.value);
        }
      });
    }
  }
  
  // View destination details
  function viewDestinationDetails(destinationId) {
    console.log('Viewing details for destination:', destinationId);
    
    fetch(`http://localhost:5000/destinations/${destinationId}`)
      .then(response => response.json())
      .then(destination => {
        displayDestinationDetails(destination);
      })
      .catch(error => {
        console.error('Error fetching destination details:', error);
        displayError('Failed to load destination details');
      });
  }
  
  // Display destination details
  function displayDestinationDetails(destination) {
    const detailsContainer = document.getElementById('destination-details');
    if (!detailsContainer) return;
    
    detailsContainer.innerHTML = `
      <h2>${destination.name}</h2>
      <p class="location">${destination.location}</p>
      <div class="description">${destination.description}</div>
      <h3>Reviews</h3>
      <div id="reviews-container"></div>
      <button id="add-review-btn">Add Review</button>
      <button id="plan-trip-btn">Plan a Trip</button>
    `;
    
    detailsContainer.style.display = 'block';
    
    // Display reviews
    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer && destination.reviews) {
      displayReviews(destination.reviews, reviewsContainer);
    }
    
    // Set up buttons
    const addReviewBtn = document.getElementById('add-review-btn');
    if (addReviewBtn) {
      addReviewBtn.addEventListener('click', () => showAddReviewForm(destination.id));
    }
    
    const planTripBtn = document.getElementById('plan-trip-btn');
    if (planTripBtn) {
      planTripBtn.addEventListener('click', () => showPlanTripForm(destination.id));
    }
  }
  
  // Search destinations
  function searchDestinations(query) {
    fetch(`http://localhost:5000/destinations/search?q=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(results => {
        displayDestinations(results);
      })
      .catch(error => {
        console.error('Error searching destinations:', error);
        displayError('Search failed. Please try again.');
      });
  }
  
  // Add more functions for user authentication, adding reviews, planning trips, etc.