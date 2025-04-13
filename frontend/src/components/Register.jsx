import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Register component for creating a new user account.
 * Validates inputs, sends POST request to backend, and stores tokens.
 */
const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5555/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      // Store tokens
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }

      localStorage.setItem('user', JSON.stringify(data.user));

      // Update parent app state
      if (onLogin) {
        onLogin(data.user);
      }

      // Redirect to trips or dashboard
      navigate('/trips');
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Connection error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container" style={styles.container}>
      <h1 style={styles.title}>Create an Account</h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.group}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div style={styles.group}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div style={styles.group}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div style={styles.group}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p style={styles.link}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

// Inline styles 
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  group: {
    display: 'flex',
    flexDirection: 'column'
  },
  button: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  link: {
    textAlign: 'center',
    marginTop: '15px'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px'
  }
};

export default Register;
