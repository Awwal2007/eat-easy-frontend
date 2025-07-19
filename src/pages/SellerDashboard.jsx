import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
import { FiHome, FiShoppingBag, FiDollarSign, FiUsers, FiSettings, FiLogOut, FiBell, FiPieChart } from 'react-icons/fi';
import { toast } from 'sonner';
// import { useAuth } from '../Hooks/useAuth'
import './css/SellerDashboard.css';
// import axios from 'axios';
import SellerMenuPage from '../components/SellerMenuPage';
import SellerOrders from '../components/SellerOrders';

const SellerDashboard = () => {
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  // const [orders, setOrders] = useState([]);
  const [sellerName, setSellerName] = useState();
  // const [stats, setStats] = useState({
  //   totalOrders: 0,
  //   completedOrders: 0,
  //   pendingOrders: 0,
  //   totalRevenue: 0
  // });
  const navigate = useNavigate();
  // const baseUrl = import.meta.env.VITE_BASE_URL;
  // const {user} = useAuth();
  
  const fetchSellerData = () => {
  const seller = localStorage.getItem('sellerData');
  if (!seller) return null;
  
  try {
    const data = JSON.parse(seller);
    setSellerName(data.restaurantName || data.name || data.email);
    setSellerData(data);

    
  } catch (error) {
    console.error('Error decoding token:', error);
  }
};






// Usage
// const userId = getUserIdFromToken();
  // Fetch seller data on component mount
  useEffect(() => {
    fetchSellerData()
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('sellerData');
    toast.success('Logged out successfully');
    navigate('/seller-signin');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>{sellerData?.restaurantName || 'My Restaurant'}</h2>
          <p>Seller Dashboard</p>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiHome className="nav-icon" />
            <span>Dashboard</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FiShoppingBag className="nav-icon" />
            <span>Orders</span>
            {/* {stats.pendingOrders > 0 && (
              <span className="notification-badge">{pendingOrders}</span>
            )} */}
          </button>

          <button 
            className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <FiShoppingBag className="nav-icon" />
            <span>Menu Items</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            <FiDollarSign className="nav-icon" />
            <span>Revenue</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <FiUsers className="nav-icon" />
            <span>Customers</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings className="nav-icon" />
            <span>Settings</span>
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'orders' && 'Orders'}
              {activeTab === 'menu' && 'Menu Management'}
              {activeTab === 'revenue' && 'Revenue Analytics'}
              {activeTab === 'customers' && 'Customers'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <FiBell />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <img 
                src={sellerData?.image || "??"} 
                alt="Profile" 
                className="profile-img"
              />
              <span>{sellerName || 'Seller'}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-overview">
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <FiShoppingBag />
                  </div>
                  <div className="stat-info">
                    <h3>Total Orders</h3>
                    {/* <p>{stats.totalOrders}</p> */}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FiPieChart />
                  </div>
                  <div className="stat-info">
                    <h3>Completed Orders</h3>
                    {/* <p>{stats.completedOrders}</p> */}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FiShoppingBag />
                  </div>
                  <div className="stat-info">
                    <h3>Pending Orders</h3>
                    {/* <p>{stats.pendingOrders}</p> */}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <FiDollarSign />
                  </div>
                  <div className="stat-info">
                    <h3>Total Revenue</h3>
                    {/* <p>${stats.totalRevenue.toFixed(2)}</p> */}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="recent-orders">
                <h2>Recent Orders</h2>
                {/* {orders.length > 0 ? (
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td>#{order.orderId}</td>
                          <td>{order.customerName}</td>
                          <td>{order.items.length} items</td>
                          <td>${order.totalAmount.toFixed(2)}</td>
                          <td>
                            <span className={`status-badge ${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button className="view-btn">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No recent orders found</p>
                )} */}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-management">
              {/* Orders management content */}
              <SellerOrders />
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="menu-management">
              <div>
                <h2>Menu Items</h2>
                {/* Menu management content */}
                <p>Menu management system will be implemented here</p>
              </div>
              <Link to="/add-product">
                <button className='add-product'>Add Foods</button>
              </Link>
              <div>
                <SellerMenuPage />
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="revenue-analytics">
              <h2>Revenue Analytics</h2>
              {/* Revenue analytics content */}
              <p>Revenue analytics will be implemented here</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-page">
              <h2>Restaurant Settings</h2>
              {/* Settings content */}
              <p>Settings management will be implemented here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;