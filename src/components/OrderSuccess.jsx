import { FaCheckCircle, FaMotorcycle, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const OrderSuccess = ({ order }) => {
  // Sample data - replace with your actual order data
  const orderDetails = {
    id: order?._id || 'ORD-123456',
    date: new Date().toLocaleDateString(),
    items: order?.items || [],
    total: order?.totalAmount || 0,
    deliveryAddress: order?.address || '123 Main St, City, Country',
    estimatedDelivery: '30-45 minutes',
    paymentMethod: order?.paymentMethod || 'Credit Card'
  };

  return (
    <div className="order-success-container">
      <div className="success-header">
        <div className="success-icon">
          <FaCheckCircle className="check-icon" />
        </div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase</p>
        <div className="order-number">Order #{orderDetails.id}</div>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        
        <div className="summary-item">
          <FiShoppingBag className="summary-icon" />
          <div>
            <h3>Items Ordered</h3>
            <ul className="ordered-items">
              {orderDetails.items.map((item, index) => (
                <li key={index}>
                  <span>{item.quantity}x <b> {item.title} </b></span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="summary-item">
          <FaMapMarkerAlt className="summary-icon" />
          <div>
            <h3>Delivery Address</h3>
            <p>{orderDetails.deliveryAddress}</p>
          </div>
        </div>

        <div className="summary-item">
          <FaClock className="summary-icon" />
          <div>
            <h3>Estimated Delivery</h3>
            <p>{orderDetails.estimatedDelivery}</p>
          </div>
        </div>

        <div className="summary-item">
          <FaMotorcycle className="summary-icon" />
          <div>
            <h3>Delivery Status</h3>
            <div className="status-timeline">
              <div className={`status-step active`}>
                <div className="step-dot"></div>
                <p>Order Confirmed</p>
              </div>
              <div className="status-step">
                <div className="step-dot"></div>
                <p>Preparing</p>
              </div>
              <div className="status-step">
                <div className="step-dot"></div>
                <p>On the way</p>
              </div>
              <div className="status-step">
                <div className="step-dot"></div>
                <p>Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="order-total">
        <h3>Total Paid</h3>
        <div className="total-amount">${orderDetails.total.toFixed(2)}</div>
        <p>Paid with {orderDetails.paymentMethod}</p>
      </div>

      <div className="action-buttons">
        <Link to="/user-profile#order" className="btn view-orders-btn">
          View All Orders
        </Link>
        <Link to="/" className="btn continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;