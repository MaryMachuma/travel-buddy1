const API_BASE_URL = 'http://localhost:5000';

export const loginUser = async (credentials) => {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Login failed' };
    }

    // Save token in localStorage
    localStorage.setItem('token', data.access_token);

    return {
      success: true,
      token: data.access_token
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An error occurred' };
  }
};

// Creating User Account
export const createUserAccount = async (userData) => {
  try {
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create account');
    }

    return data;
  } catch (error) {
    console.error('Account creation error:', error);
    throw error;
  }
};

// ======================
// User Profile APIs
// ======================
export const getUserProfile = async () => {
const response = await fetch(`${API_BASE_URL}/profile`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});
return response.json();
};

export const updateUserProfile = async (profileData) => {
const response = await fetch(`${API_BASE_URL}/profile`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify(profileData),
});
return response.json();
};

// ======================
// Destination APIs
// ======================
export const searchDestinations = async (city) => {
const response = await fetch(`http://localhost:5000/destinations?city=${city}`);
return response.json();
};

export const getDestinationDetails = async (id) => {
const response = await fetch(`http://localhost:5000/destinations/${id}`);
return response.json();
};

// ======================
// Trip Management APIs
// ======================
export const addToTrips = async (tripData) => {
const response = await fetch(`${API_BASE_URL}/trips`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify(tripData),
});
return response.json();
};

export const submitTrip = async (tripId) => {
const response = await fetch(`http://localhost:5000/trips/${tripId}/submit`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});
return response.json();
};

export const cancelTrip = async (tripId) => {
const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});
return response.json();
};

export const getUserTrips = async () => {
const response = await fetch(`${API_BASE_URL}/trips`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});
return response.json();
};

// ======================
// Review APIs
// ======================
export const submitReview = async (reviewData) => {
const response = await fetch(`${API_BASE_URL}/reviews`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
  body: JSON.stringify(reviewData),
});
return response.json();
};

// ======================
// Helper Functions
// ======================
export const checkAuthStatus = () => {
return !!localStorage.getItem('token');
};

export const logoutUser = () => {
localStorage.removeItem('token');
};