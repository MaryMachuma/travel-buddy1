import React from 'react';
import { Link } from 'react-router-dom';

const UserAccount = ({ mode }) => {
  return (
    <div className="page-container">
      <h1>{mode === 'profile' ? 'Your Profile' : 'Register'}</h1>
      
      {mode === 'profile' ? (
        <div>
          <p>Your profile information will be displayed here.</p>
          <Link to="/trips">View My Trips</Link>
        </div>
      ) : (
        <div>
          <p>Registration form will go here.</p>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      )}
    </div>
  );
};

export default UserAccount;