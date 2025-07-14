import React, { useEffect } from 'react';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import './css/CartPage.css';
import { useCart } from '../Hooks/useCart';



const CartPage = () => {
  // const [cartItems, setCartItems] = useState([]);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {deleteCart, cart, fetchCart, cartIsLoading,  } = useCart();



  useEffect(() => {
    fetchCart();
    
  }, []);

  


  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };


  const removeItem = async (itemId) => {
    await deleteCart(itemId);
    setTimeout(() => {
        fetchCart();
      }, 1000);
  }

  if (cartIsLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {/* Cart Header */}
      <div className="cart-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft />
        </button>
        <h1>Your Cart</h1>
        <div className="cart-icon">
          <FiShoppingCart />
          {cart.length > 0 && (
            <span className="cart-count">{cart ? cart.length : 0}</span>
          )}
        </div>
      </div>

      {/* Restaurant Info */}
      {/* {restaurant && (
        <div className="restaurant-info">
          <img src={restaurant.logo} alt={restaurant.name} className="restaurant-logo" />
          <div className="restaurant-details">
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisineType}</p>
          </div>
        </div>
      )} */}

      {/* Cart Items */}
      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <FiShoppingCart size={48} />
            <h2>Your cart is empty</h2>
            <p>Browse restaurants and add items to get started</p>
            <Link to="/all-product" className="browse-button">
              Browse Foods
            </Link>
          </div>
        ) : (
          <>
            {Array.isArray(cart) && cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-price">Price: ${item.price.toFixed(2)}</p>
                  <div className="rating-section">
                    <span className="rating-stars">
                      {'★'.repeat(Math.round(item.rating || 0))}
                      {'☆'.repeat(5 - Math.round(item.rating || 0))}
                    </span>
                    <span className="rating-value">
                      ({item.rating?.toFixed(1) || '0.0'})
                    </span>
                  </div>
                  <div>
                    <p className="item-description">Description: {item.description}</p>
                    <p className="item-description">Category: {item.category}</p>
                    <p style={{color: "orange"}} className='item-price'>SubTotal: ${item.subTotal}</p>
                  </div>
                 <span>Quantity: {item.quantity}</span>
                </div>
                <div className="item-actions">
                  <button 
                      className="remove-button"
                      onClick={() => removeItem(item._id)}
                  >
                      <FiTrash2 />
                  </button>
                </div>
            </div>
            ))}
          </>
        )}
      </div>

      {/* Order Summary */}
      {cart.length > 0 && (
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>Free</span>
          </div>
          
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          
          <button 
            className="checkout-button"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;