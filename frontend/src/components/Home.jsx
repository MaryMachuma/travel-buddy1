import React from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer'; // adjust the path if necessary

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Travel Buddy</h1>
          <p>Discover amazing destinations and plan your next adventure</p>
          <Link to="/destinations" className="btn btn-primary">
            Explore Destinations
          </Link>
        </div>
      </header>

      <section className="about-section">
        <h2>About Travel Buddy</h2>
        <p>
          Travel Buddy is your ultimate companion for planning unforgettable trips.
          Browse our curated destinations, book your dream vacation, and create
          memories that last a lifetime.
        </p>
      </section>

      <section className="featured-destinations">
        <h2>Featured Destinations</h2>
        <div className="destinations-grid">
          {/* This would be populated from your API */}
          <div className="destination-card">
            <div className="destination-image placeholder"></div>
            <h3>Paris, France</h3>
            <p>Experience the city of love and its iconic landmarks</p>
          </div>
          <div className="destination-card">
            <div className="destination-image placeholder"></div>
            <h3>Tokyo, Japan</h3>
            <p>Immerse yourself in this vibrant metropolis</p>
          </div>
          <div className="destination-card">
            <div className="destination-image placeholder"></div>
            <h3>New York, USA</h3>
            <p>Explore the city that never sleeps</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
