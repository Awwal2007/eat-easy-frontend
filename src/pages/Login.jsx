import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./css/Login.css"; // Reusing your existing styles
import authLogo from "../assets/eat-easy logo auth.png";
import authImage from "../assets/Auth-main.png";

import { useAuth } from '../Hooks/useAuth';

const Login = () => {
  const {signin, signingIn} = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signin(formData)
  };

  return (
    <div className='container'>
      <div className='left'>
        <Link to="/">
          <img className='ath-logo' src={authLogo} alt="EatEasy Logo" />
        </Link>
        <h5>Login to enjoy your order</h5>
        <p>Login now to Enjoy Fast and Endless Food Orders.</p>
        <img className='auth-main-img' src={authImage} alt="Food delivery" />
      </div>
      <div className='right'>
        <div className="form-container">
          <p className='already'>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
          <div className='top-text'>
            <h2>Welcome back to EatEasy</h2>
            <p>Suggests convenience and hassle-free ordering</p>
            <h2>Login</h2>
            <p>Enter your credentials to access your dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className='form'>
            <div className='input'>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                placeholder="Your registered email" 
                name='email' 
                id='email' 
                value={formData.email}
                onChange={handleInput}
              />
            </div>
            <div className='input'>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                name='password' 
                id='password' 
                value={formData.password}
                onChange={handleInput}
              />
            </div>
            <div className='forgot-password'>
              <Link to="/seller-forgot-password">Forgot password?</Link>
            </div>
            <div className='signup'>
              <button disabled={signingIn}>
                {signingIn ? "Logging in..." : "Login"}
              </button>
            </div>
            <hr />
            <div>
              <p className='privacy-policy'>By logging in, you agree to our <span>Terms of Service</span> and <span>Privacy Policy</span></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;