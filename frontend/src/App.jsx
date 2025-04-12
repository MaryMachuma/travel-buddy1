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
};

export default App;