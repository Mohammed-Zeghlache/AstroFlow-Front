import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sign.css';

const Sign = () => {
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
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
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
        const response = await axios.post('http://localhost:10000/api/signup', {
          fullName: formData.fullName,
          email: formData.email
        });

        if (response.data.success) {
          // Store user data
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          console.log('✅ Signup successful:', response.data.user);
            setTimeout(() => {
          navigate('/home');
        }, 2000);
        }
      } catch (error) {
        console.error('Signup error:', error);
        setApiError(
          error.response?.data?.message || 
          'Signup failed. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="galaxy-signup-container">
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

      {/* Signup Card */}
      <div className="galaxy-signup-card">
        <div className="card-inner">
          <div className="card-glow"></div>
          
          <div className="galaxy-signup-header">
            <div className="galaxy-logo">
              <span className="logo-icon">✨</span>
              <span className="logo-text">AstroFlow </span>
            </div>
            <h1 className="galaxy-title">Join the Galaxy</h1>
            <p className="galaxy-subtitle">Create your account to begin</p>
          </div>

          {apiError && (
            <div className="api-error-message">
              <span className="error-icon">⚠️</span>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="galaxy-signup-form">
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span className="button-text">Create Account</span>
                  <span className="button-icon">✨</span>
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
            
            <Link to="/login" className="galaxy-link">
              Already have an account? 
              <span className="link-text"> Sign In</span>
              <span className="link-icon">→</span>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .api-error-message {
          background: rgba(255, 68, 68, 0.1);
          border: 1px solid #ff4444;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 20px;
          color: #ff4444;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: shake 0.5s ease;
        }

        .button-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 0, 0, 0.3);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .galaxy-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Sign;