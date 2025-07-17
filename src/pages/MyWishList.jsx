import React, { useEffect } from 'react';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
import './css/CartPage.css';
import { useCart } from '../Hooks/useCart';
import useMediaQuery from '../components/MediaQuery'

const MyWishList = () => {

    const isMobile = useMediaQuery('(max-width: 500px)')
    const navigate = useNavigate();
    const {deleteWishList, wishList, fetchWishList, wishListLoading,  } = useCart();



    useEffect(() => {
        fetchWishList(); 
    }, []);


    const removeItem = async (itemId) => {
        await deleteWishList(itemId);
        setTimeout(() => {
            fetchWishList();
        }, 500);
    }


    if (wishListLoading) {
        return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your wishList...</p>
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
        <h1>Your Wish Item</h1>
        <div style={{left: isMobile ? "310px" : "500px"}} className="cart-icon">
          {/* <FiShoppingCart /> */}
          <div className="cart-icon">
            {wishList?.length || 0}
            </div>

          {/* {wishList.length > 0 && (
            <span className="cart-count">{wishList ? wishList.length : 0}</span>
          )} */}
        </div>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {!Array.isArray(wishList) || wishList.length === 0 ? (
          <div className="empty-cart">
            <FiShoppingCart size={48} />
            <h2>Your Wish List is empty</h2>
            <p>Browse restaurants and add items to your wish list</p>
            <Link to="/all-product" className="browse-button">
              Browse Foods
            </Link>
          </div>
        ) : (
          <>
            {wishList.map(item => (
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
                  </div>
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

    </div>
  )
}

export default MyWishList