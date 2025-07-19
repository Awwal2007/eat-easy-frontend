import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('sellerToken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/order/seller`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
        console.log(res);
        
      } catch (error) {
        console.error('Error fetching seller orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <h4>Order from: {order.user?.name || 'Unknown user'}</h4>
            <p>Total: ${order.totalAmount}</p>
            <p>Status: {order.status}</p>
            <ul>
              {order.items.map(item => (
                <li key={item.productId}>
                  {item.title} × {item.quantity} — ${item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <hr />
          </div>
        ))
      )}
    </div>
  );
};

export default SellerOrders;
