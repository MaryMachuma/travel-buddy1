// src/components/Home.jsx
import React from 'react';
import Destinations from './Destinations';
import Footer from './Footer';

const Home = () => {
  return (
  <div>
    <div className="home-page">
        <section className="featured-destinations">
        <h2>Popular Destinations</h2>
        <Destinations />
      </section>
      
      <section className="app-features">
        <div className="feature-card">
          <h3>Create your Travel-Buddy Account</h3>
          <p className='home'>Afterwards login to your account</p>
        </div>
        <div className="feature-card">
          <h3>Browse the most popular destinations in cities around the globe</h3>
          <p className='home'>That has been made effortless through the search bar</p>
        </div>
        <div className="feature-card">
          <h3>Plan your desired trip</h3>
          <p className='home'>Navigate to your trip section to officially plan your desired trip</p>
        </div>
      </section>
    </div>
     <Footer />
    </div>
  );
};

export default Home;