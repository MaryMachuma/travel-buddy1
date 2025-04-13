import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const User = ({ onLogin }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetch('/profile', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      })
        .then((response) => {
          if (response.ok) return response.json();
          throw new Error('Not logged in');
        })
        .then((userData) => {
          setUser(userData);
          onLogin(userData);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          setUser(null);
          navigate('/');
        });
    }
  }, [onLogin]);

  const loginSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const registerSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, remember_me: true }),
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
      setUser(data.user);
      onLogin(data.user);
      navigate('/my-trips');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error('Registration failed');
      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setUser(data.user);
      onLogin(data.user);
      navigate('/my-trips');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setError(null);
    navigate('/');
  };

  return (
    <div className="user-container">
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      {error && <p className="error">{error}</p>}
      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <Formik
          initialValues={
            isRegistering
              ? { username: '', email: '', password: '' }
              : { username: '', password: '' }
          }
          validationSchema={isRegistering ? registerSchema : loginSchema}
          onSubmit={isRegistering ? handleRegister : handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Field name="username" type="text" />
                <ErrorMessage name="username" component="div" className="error" />
              </div>
              {isRegistering && (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field name="email" type="email" />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field name="password" type="password" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isRegistering ? 'Register' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? 'Switch to Login' : 'Switch to Register'}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default User;