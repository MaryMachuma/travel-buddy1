// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Destinations from './components/Destinations';
import PersonalTrips from './components/PersonalTrips';
import UserAccount from './components/UserAccount';
import Login from './components/Login';
import NavBar from './components/NavBar';
import Booking from './components/Booking';
import './styles.css';

const App = () => {

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import User from './User';
import Destination from './Destination';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  // Placeholder components for other routes
  const MyTrips = () => (
    <div className="page-container">
      <h1>My Trips</h1>
      <p>{currentUser ? `Welcome, ${currentUser.username}! Your trips will be here.` : 'Please log in to see your trips.'}</p>
      <Link to="/destinations">Browse Destinations</Link>
    </div>
  );

  const PlanTrip = () => (
    <div className="page-container">
      <h1>Plan a Trip</h1>
      <p>{currentUser ? 'Form to plan a trip goes here.' : 'Please log in to plan a trip.'}</p>
      <Link to="/destinations">Back to Destinations</Link>
    </div>
  );


  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  return (
    <Router>

      <NavBar />
      <div className="app-container">
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route 
              path="/account" 
              element={isAuthenticated ? <UserAccount mode="profile" /> : <UserAccount mode="register" />} 
            />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/trips" 
              element={isAuthenticated ? <PersonalTrips /> : <Navigate to="/login" />} 
            />  
            <Route path="/booking" element={<Booking />} />
        
            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
    );

      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="nav-bar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/destinations" className="nav-link">Destinations</Link>
          {currentUser ? (
            <>
              <Link to="/my-trips" className="nav-link">My Trips</Link>
              <Link to="/plan-trip" className="nav-link">Plan a Trip</Link>
              <span className="nav-user">Hi, {currentUser.username}</span>
            </>
          ) : (
            <span className="nav-user">Please log in</span>
          )}
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<User onLogin={setCurrentUser} />} />
          <Route path="/destinations" element={<Destination user={currentUser} />} />
          <Route path="/my-trips" element={<MyTrips />} />
          <Route path="/plan-trip" element={<PlanTrip />} />
        </Routes>
      </div>
    </Router>
  );

};

export default App;