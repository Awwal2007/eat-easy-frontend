import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'sonner';
import './css/Login.css';
import authLogo from "../assets/eat-easy logo auth.png";
import authImage from "../assets/Auth-main.png";
import { useAuth } from '../Hooks/useAuth';
import useMediaQuery from '../components/MediaQuery';

const Login = () => {
  const { signin, signingIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await signin(formData);
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className='auth-container'>
      {!isMobile && (
        <div className='auth-left'>
          <Link to="/">
            <img className='auth-logo' src={authLogo} alt="EatEasy Logo" />
          </Link>
          <h5>Login to enjoy your order</h5>
          <p>Login now to Enjoy Fast and Endless Food Orders.</p>
          <img className='auth-hero' src={authImage} alt="Food delivery" />
        </div>
      )}

      <div className='auth-right'>
        <div className="auth-form-container">
          {isMobile && (
            <button className="back-button" onClick={() => navigate(-1)}>
              <FiArrowLeft />
            </button>
          )}
          
          <p className='auth-switch'>
            Don't have an account? <Link to='/signup'>Sign Up</Link>
          </p>
          
          <div className='auth-header'>
            <h2>Welcome back to EatEasy</h2>
            <p className="auth-subheader">Suggests convenience and hassle-free ordering</p>
            <h3>Login</h3>
            <p className="auth-instructions">Enter your credentials to access your dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className='auth-form'>
            <div className={`auth-input-group ${errors.email ? 'error' : ''}`}>
              <label htmlFor="email">
                <FiMail className="input-icon" />
                Email
              </label>
              <input 
                type="email" 
                placeholder="Your registered email" 
                name='email' 
                id='email' 
                value={formData.email}
                onChange={handleInput}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className={`auth-input-group ${errors.password ? 'error' : ''}`}>
              <label htmlFor="password">
                <FiLock className="input-icon" />
                Password
              </label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                name='password' 
                id='password' 
                value={formData.password}
                onChange={handleInput}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className='auth-options'>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            
            <div className='auth-actions'>
              <button type="submit" disabled={signingIn} className="auth-submit-btn">
                {signingIn ? "Logging in..." : "Login"}
              </button>
            </div>
            
            <div className="auth-terms">
              <p>
                By logging in, you agree to our{' '}
                <Link to="/terms" className="terms-link">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;