import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiCreditCard, FiMapPin, FiClock, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import './css/CheckoutPage.css';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryInstructions: '',
    paymentMethod: 'cash'
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Load cart and restaurant data
  useEffect(() => {
    const loadCheckoutData = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const restaurantData = JSON.parse(localStorage.getItem('currentRestaurant')) || null;
        
        setCartItems(savedCart);
        setRestaurant(restaurantData);
        
        // Pre-fill user data if available
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        setFormData(prev => ({
          ...prev,
          name: userData.name || '',
          phone: userData.phone || '',
          address: userData.address || ''
        }));
      } catch (error) {
        console.error('Error loading checkout data:', error);
        toast.error('Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = restaurant?.deliveryFee || 0;
    const tax = subtotal * 0.1; // 10% tax
    return subtotal + deliveryFee + tax;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/restaurants');
      return;
    }

    if (!validateForm()) return;

    try {
      // In a real app, you would call your API here
      const orderData = {
        restaurantId: restaurant?._id,
        items: cartItems,
        customerInfo: formData,
        subtotal: calculateSubtotal(),
        deliveryFee: restaurant?.deliveryFee || 0,
        tax: calculateSubtotal() * 0.1,
        total: calculateTotal(),
        status: 'pending'
      };

      // Simulate API call
      console.log('Submitting order:', orderData);
      
      // Clear cart after successful order
      localStorage.removeItem('cart');
      localStorage.removeItem('currentRestaurant');
      
      toast.success('Order placed successfully!');
      navigate('/order-confirmation', { state: { order: orderData } });
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart before checking out</p>
        <Link to="/restaurants" className="browse-button">
          Browse Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button onClick={() => navigate(-1)} className="checkout-back-button">
          <FiArrowLeft />
        </button>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        {/* Delivery Information */}
        <section className="checkout-section">
          <h2>
            <FiUser className="section-icon" />
            Delivery Information
          </h2>
          
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className={`form-group ${errors.name ? 'error' : ''}`}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className={`form-group ${errors.phone ? 'error' : ''}`}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Your phone number"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className={`form-group ${errors.address ? 'error' : ''}`}>
              <label htmlFor="address">
                <FiMapPin className="inline-icon" />
                Delivery Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Your delivery address"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="deliveryInstructions">
                <FiClock className="inline-icon" />
                Delivery Instructions (Optional)
              </label>
              <textarea
                id="deliveryInstructions"
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                placeholder="Gate code, building instructions, etc."
                rows="3"
              />
            </div>
          </form>
        </section>

        {/* Payment Method */}
        <section className="checkout-section">
          <h2>
            <FiCreditCard className="section-icon" />
            Payment Method
          </h2>
          
          <div className={`payment-methods ${errors.paymentMethod ? 'error' : ''}`}>
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formData.paymentMethod === 'cash'}
                onChange={handleInputChange}
              />
              <span>Cash on Delivery</span>
            </label>
            
            <label className="payment-method">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleInputChange}
              />
              <span>Credit/Debit Card</span>
            </label>
            
            {errors.paymentMethod && (
              <span className="error-message">{errors.paymentMethod}</span>
            )}
          </div>
        </section>

        {/* Order Summary */}
        <section className="checkout-section">
          <h2>Order Summary</h2>
          
          <div className="order-restaurant">
            <img src={restaurant?.logo} alt={restaurant?.name} className="restaurant-logo" />
            <div>
              <h3>{restaurant?.name}</h3>
              <p>{restaurant?.cuisineType}</p>
            </div>
          </div>
          
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <span className="item-quantity">{item.quantity}x</span>
                  <span className="item-name">{item.name}</span>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            
            <div className="total-row">
              <span>Delivery Fee</span>
              <span>${restaurant?.deliveryFee?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="total-row">
              <span>Tax (10%)</span>
              <span>${(calculateSubtotal() * 0.1).toFixed(2)}</span>
            </div>
            
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Checkout Footer */}
      <div className="checkout-footer">
        <button 
          type="submit" 
          className="place-order-btn"
          onClick={handleSubmit}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;