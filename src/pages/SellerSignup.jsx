import { useState } from 'react'
import { FiUser, FiMail, FiPhone, FiLock, FiMapPin, FiHome, FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import './css/SellerSignup.css'

const SellerSignup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    restaurantName: '',
    cuisineType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    openingTime: '09:00',
    closingTime: '21:00',
    deliveryRadius: 5
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const baseUrl = import.meta.env.VITE_BASE_URL
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (!formData.restaurantName.trim()) newErrors.restaurantName = 'Restaurant name is required'
    if (!formData.cuisineType.trim()) newErrors.cuisineType = 'Cuisine type is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    setSuccessMessage('')
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      try {
        // API call to register seller
        const response = await axios.post(`${baseUrl}/seller/signup`, formData)
        console.log(response);
        
        if (response.data.status === "success") {
          setSuccessMessage(response.data.message)
          toast.success(response.data.message)
          // Store token in localStorage or context
          localStorage.setItem('sellerToken', response.data.token)
          // Redirect after 2 seconds
          setTimeout(() => {
            navigate('/seller-signin')
          }, 2000)
        }else{
          setApiError("failed to sign up")
        }
      } catch (error) {
        console.error('Registration error:', error)
        setApiError(error.response?.data?.message || 'An error occurred during registration')
      } finally {       
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="seller-signup-container">
      <div className="seller-signup-card">
        <button className="close-btn" onClick={() => navigate('/')}>
          <FiX />
        </button>
        
        <div className="signup-header">
          <h2>Register Your Restaurant</h2>
          <p>Join our platform and reach thousands of customers</p>
        </div>
        
        {apiError && <div className="alert error">{apiError}</div>}
        {successMessage && <div className="alert success">{successMessage}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className={`form-group ${errors.name ? 'error' : ''}`}>
                <label htmlFor="name">
                  <FiUser /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className={`form-group ${errors.email ? 'error' : ''}`}>
                <label htmlFor="email">
                  <FiMail /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                <label htmlFor="phone">
                  <FiPhone /> Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+2341567890"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              
              <div className={`form-group ${errors.password ? 'error' : ''}`}>
                <label htmlFor="password">
                  <FiLock /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Restaurant Information</h3>
            <div className="form-grid">
              <div className={`form-group ${errors.restaurantName ? 'error' : ''}`}>
                <label htmlFor="restaurantName">
                  <FiHome /> Restaurant Name
                </label>
                <input
                  type="text"
                  id="restaurantName"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  placeholder="Your restaurant name"
                />
                {errors.restaurantName && <span className="error-message">{errors.restaurantName}</span>}
              </div>
              
              <div className={`form-group ${errors.cuisineType ? 'error' : ''}`}>
                <label htmlFor="cuisineType">Cuisine Type</label>
                <select
                  id="cuisineType"
                  name="cuisineType"
                  value={formData.cuisineType}
                  onChange={handleChange}
                >
                  <option value="">Select cuisine type</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Other">Other</option>
                </select>
                {errors.cuisineType && <span className="error-message">{errors.cuisineType}</span>}
              </div>
              
              <div className={`form-group ${errors.address ? 'error' : ''}`}>
                <label htmlFor="address">
                  <FiMapPin /> Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              
              <div className="form-group-group">
                <div className={`form-group ${errors.city ? 'error' : ''}`}>
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                
                <div className={`form-group ${errors.state ? 'error' : ''}`}>
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
                
                <div className={`form-group ${errors.zipCode ? 'error' : ''}`}>
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Zip code"
                  />
                  {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Restaurant Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your restaurant..."
                  rows="3"
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Business Hours</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="openingTime">Opening Time</label>
                <input
                  type="time"
                  id="openingTime"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="closingTime">Closing Time</label>
                <input
                  type="time"
                  id="closingTime"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="deliveryRadius">Delivery Radius (miles)</label>
                <input
                  type="number"
                  id="deliveryRadius"
                  name="deliveryRadius"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  min="1"
                  max="20"
                />
              </div>
            </div>
          </div>
          
          <div className="form-footer">
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register Restaurant'}
            </button>
            
            <p className="login-link">
              Already have an account? <button type="button" onClick={() => navigate('/seller-signin')}>Log in</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellerSignup