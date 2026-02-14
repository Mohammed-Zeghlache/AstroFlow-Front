import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      try {
        const response = await axios.post('https://astrof.onrender.com/api/login', {
          fullName: formData.fullName,
          email: formData.email
        });

        if (response.data.success) {
          // Store user data
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          console.log('✅ Login successful:', response.data.user);
          // navigate('/home');
            setTimeout(() => {
          navigate('/home');
        }, 1000);
        }
      } catch (error) {
        console.error('Login error:', error);
        setApiError(
          error.response?.data?.message || 
          'Login failed. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="galaxy-login-container">
      {/* Galaxy Background */}
      <div className="galaxy-background">
        <div className="stars"></div>
        <div className="twinkling"></div>
        <div className="nebula nebula-1"></div>
        <div className="nebula nebula-2"></div>
        <div className="nebula nebula-3"></div>
        <div className="galaxy galaxy-1"></div>
        <div className="galaxy galaxy-2"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star-2"></div>
        <div className="planet planet-1"></div>
        <div className="planet planet-2"></div>
      </div>

      {/* Login Card */}
      <div className="galaxy-login-card">
        <div className="card-inner">
          <div className="card-glow"></div>
          
          <div className="galaxy-login-header">
            <div className="galaxy-logo">
              <span className="logo-icon">✨</span>
              <span className="logo-text">AstroFlow </span>
            </div>
            <h1 className="galaxy-title">Welcome Back</h1>
            <p className="galaxy-subtitle">Sign in to continue your journey</p>
          </div>

          {apiError && (
            <div className="api-error-message">
              <span className="error-icon">⚠️</span>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="galaxy-login-form">
            <div className={`galaxy-input-wrapper ${errors.fullName ? 'error' : ''}`}>
              <span className="input-icon">👤</span>
              <div className="input-field">
                <label className={`input-label ${formData.fullName ? 'active' : ''}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="galaxy-input"
                />
              </div>
              <div className="input-border"></div>
            </div>
            {errors.fullName && <span className="galaxy-error">{errors.fullName}</span>}

            <div className={`galaxy-input-wrapper ${errors.email ? 'error' : ''}`}>
              <span className="input-icon">📧</span>
              <div className="input-field">
                <label className={`input-label ${formData.email ? 'active' : ''}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="galaxy-input"
                />
              </div>
              <div className="input-border"></div>
            </div>
            {errors.email && <span className="galaxy-error">{errors.email}</span>}

            <button 
              type="submit" 
              className="galaxy-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="button-spinner"></span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span className="button-text">Sign In</span>
                  <span className="button-icon">→</span>
                </>
              )}
              <div className="button-stars"></div>
            </button>
          </form>

          <div className="galaxy-footer">
            <div className="galaxy-divider">
              <span className="divider-star">✦</span>
              <span className="divider-line"></span>
              <span className="divider-star">✦</span>
            </div>
            
            <Link to="/signup" className="galaxy-link">
              New to StarForge? 
              <span className="link-text"> Create account</span>
              <span className="link-icon">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
