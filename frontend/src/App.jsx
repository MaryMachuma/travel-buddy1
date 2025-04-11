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

  return (
    <Router>
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