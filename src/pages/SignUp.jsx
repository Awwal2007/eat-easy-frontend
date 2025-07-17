import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./css/SignUp.css";
import authLogo from "../assets/eat-easy logo auth.png";
import authImage from "../assets/Auth-main.png";
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { FiUser, FiMail, FiLock, FiImage } from 'react-icons/fi';
import useMediaQuery from '../components/MediaQuery';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    authImage: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [signingUp, setSigningup] = useState(false);
  const [errors, setErrors] = useState({});
  const isMobile = useMediaQuery('(max-width: 768px)');
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, authImage: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("password", formData.password);
    if (formData.authImage) {
      form.append("authImage", formData.authImage);
    }

    setSigningup(true);
    try {
      const response = await axios.post(`${baseUrl}/auth/signup`, form, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      
      const data = response.data;
      if (data.status === "success") {
        toast.success(data.message);
        navigate("/signin");
      } else {
        toast.error(data.message || "Sign up failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Sign up failed");
    } finally {
      setSigningup(false);
    }
  };

  return (
    <div className='auth-container'>
      {!isMobile && (
        <div className='auth-left'>
          <Link to="/">
            <img className='auth-logo' src={authLogo} alt="EatEasy Logo" />
          </Link>
          <h5>Sign Up and enjoy your order</h5>
          <p>Sign up now to Enjoy Fast and Endless Food Orders.</p>
          <img className='auth-hero' src={authImage} alt="Food delivery" />
        </div>
      )}

      <div className='auth-right'>
        <div className="auth-form-container">
         
          <p className='auth-switch'>
            
            Already have an account? <Link to='/signin'>Sign In</Link>
          </p>
          
          <div style={{textAlign: "center"}}>
             {isMobile && (
            <Link to="/">
            <img className='auth-logo' src={authLogo} alt="EatEasy Logo" />
          </Link>
          ) }
          </div>
          
          <div className='auth-header'>
            <h2>Welcome to EatEasy</h2>
            <p className="auth-subheader">Suggests convenience and hassle-free ordering</p>
            <h3>Create an account</h3>
            <p className="auth-instructions">Enter your info to sign up for this app</p>
          </div>
          
          <form onSubmit={handleSubmit} className='auth-form'>
            <div className={`auth-input-group ${errors.name ? 'error' : ''}`}>
              <label htmlFor="name">
                <FiUser className="input-icon" />
                Full Name
              </label>
              <input 
                type="text" 
                placeholder="Your full name" 
                name='name' 
                id='name' 
                value={formData.name}
                onChange={handleInput} 
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className={`auth-input-group ${errors.email ? 'error' : ''}`}>
              <label htmlFor="email">
                <FiMail className="input-icon" />
                Email
              </label>
              <input 
                type="email" 
                placeholder="Your email address" 
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
                placeholder="Create a password" 
                name='password' 
                id='password' 
                value={formData.password}
                onChange={handleInput}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="auth-input-group">
              <label htmlFor="profilePicture">
                <FiImage className="input-icon" />
                Profile Picture (Optional)
              </label>
              <div className="image-upload-container">
                <label htmlFor="profilePicture" className="image-upload-label">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="image-upload-placeholder">
                      <FiImage size={24} />
                      <span>Click to upload image</span>
                    </div>
                  )}
                </label>
                <input
                  type="file"
                  id="profilePicture"
                  name="authImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-upload-input"
                />
              </div>
            </div>
            
            <div className='auth-actions'>
              <button type="submit" disabled={signingUp} className="auth-submit-btn">
                {signingUp ? "Creating account..." : "Sign Up"}
              </button>
            </div>
            
            <div className="auth-terms">
              <p>
                By clicking continue, you agree to our{' '}
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

export default SignUp;