import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Login component for authenticating users.
 * On successful login, stores the token and redirects to the trips page.
 */
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Submitting login request to:', 'http://127.0.0.1:5555/login');
      console.log('With data:', { username, password });
      
      const response = await fetch('http://127.0.0.1:5555/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
       
        body: JSON.stringify({ username, password })
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        setError(data.error || 'Login failed. Please check your credentials.');
        return;
      }
      
      // Save tokens in localStorage
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }
      
      // Save user info if returned
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Notify parent component about login
      if (onLogin) {
        onLogin(data.user);
      }
      
      // Redirect to trips page
      navigate('/trips');
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container" style={styles.container}>
      <h1 style={styles.title}>Login to Travel Buddy</h1>
      
      {error && <p style={styles.error}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.group}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div style={styles.group}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={styles.link}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

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
    backgroundColor: '#0d6efd',
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

export default Login;