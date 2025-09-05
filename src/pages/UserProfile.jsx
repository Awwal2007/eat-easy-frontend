import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit, FiClock, FiShoppingBag } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import './css/UserProfile.css';
import axios from 'axios';
import { useAuth } from '../Hooks/useAuth';

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [userUpdatedData, setUserUpdatedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [changesLoading, setChangesLoading] = useState(false);
  const {logout} = useAuth();
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recentOrders, setRecentOrders] = useState([])

  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('accessToken')

  // const recentOrders = [
  //   {
  //     id: 'ORD12345',
  //     date: '2023-05-15',
  //     restaurant: 'Burger Palace',
  //     items: ['Cheeseburger', 'Fries', 'Soda'],
  //     total: 18.99,
  //     status: 'Delivered'
  //   },
  //   {
  //     id: 'ORD12344',
  //     date: '2023-05-10',
  //     restaurant: 'Pizza Heaven',
  //     items: ['Margherita Pizza', 'Garlic Bread'],
  //     total: 24.50,
  //     status: 'Delivered'
  //   }
  // ];

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?._id;
      if (!userId) return;

      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/users/${userId}`);
        const data = res.data;
        setUserData(data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      setUserUpdatedData({
        name: userData.name,
        authImage: userData.image
      });
    }
  }, [userData]);

  useEffect(() => {
    const fetchOrder = async()=>{
      try {
        const res = await axios.get(`${baseUrl}/order/my-orders`,{
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        const data = res.data
        console.log(data);          
        setRecentOrders(data.myOrders)

      } catch (error) {
        console.log(error);          
      }
    }
    fetchOrder()
  }, [])
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserUpdatedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserUpdatedData(prev => ({
        ...prev,
        authImage: file
      }));
    }
  };

  const handleSave = async () => {
    setChangesLoading(true)
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?._id;
    if (!userId) return;

    const formData = new FormData();
    formData.append("name", userUpdatedData.name);
    if (userUpdatedData.authImage instanceof File) {
      formData.append("authImage", userUpdatedData.authImage);
    }

    try {
      
      const res = await axios.put(`${baseUrl}/users/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if(res.data.status === "success"){
        toast.success('Profile updated successfully');
        setUserData(res.data.user);
        setIsEditing(false);
        setTimeout(()=>{
          window.location.reload();
        }, 500)
      }
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
      // setChangesLoading(false)
    }finally{
      setChangesLoading(false)
    }
  };

  const handleChangePassword = async () => {
    setChangesLoading(true)
    if (!currentPassword || !newPassword) {
        toast.error("Please fill in both fields.");
        setChangesLoading(false)
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    try {
        const res = await axios.put(`${baseUrl}/auth/update-password/${userId}`, {
            currentPassword,
            newPassword,
        });


        if (res.data.status === "success") {
            toast.success("Password updated successfully");
            setShowPasswordChange(false);
            setCurrentPassword('');
            setNewPassword('');
        } else {
            console.log(res.data)
            toast.error(res.data.message || "Failed to update password");
        }
    } catch (error) {
        console.error(error);
        toast.error("Incorrect current password or server error.");
        setChangesLoading(false)
    }finally{
      setChangesLoading(false)
    }
  };


  const handleLogout = () => {
    logout()
  };


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
          <FiEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-picture-container">
            <img
              src={
                isEditing && userUpdatedData.authImage instanceof File
                  ? URL.createObjectURL(userUpdatedData.authImage)
                  : userUpdatedData.authImage
              }
              alt="Profile"
              className="profile-picture"
            />
            {isEditing && (
              <label className="change-photo-btn">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          <div className="profile-details">
            <div className={`form-group ${isEditing ? 'editable' : ''}`}>
              <label><FiUser /> Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={userUpdatedData.name}
                  onChange={handleInputChange}
                />
              ) : (
                <p>{userData?.name}</p>
              )}
            </div>

            <div className="form-group">
              <label><FiMail /> Email</label>
              <p>{userData?.email}</p>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button className="save-button" onClick={handleSave}>
                  {changesLoading? 'Saving...' : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="orders-section">
          <h2><FiShoppingBag /> Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="orders-list">
              {recentOrders
              .sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt) )
              .slice(0,5)
              .map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">Order #{order._id}</span>
                    <span className="order-date"><FiClock /> {new Date(order.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}</span>
                  </div>
                  <div className="order-restaurant">{order.restaurant}</div>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <span key={index} className="order-item">{item.quantity}x {item.title}</span>
                    ))}
                  </div>
                  <div>
                    <b style={{color: "#fe724c"}}>${order.totalAmount}</b>
                  </div>
                  <br />
                  <div className="order-footer">
                    {/* <span className="order-total">${order.total.toFixed(2)}</span> */}
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                    {order.items.map((item, index)=>(
                        <button key={index}
                        className="reorder-button"
                        onClick={() =>
                          navigate(`/product/${item.productId}`)
                        }
                      >
                        Reorder
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders">
              <p>You haven't placed any orders yet.</p>
              <Link to="/all-product" className="browse-button">
                Browse Foods
              </Link>
            </div>
          )}
        </div>

        {/* Account Settings Section */}
        <div className="settings-section">
            <h2>Account Settings</h2>

            <div className="settings-options">
                <button
                className="settings-button"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                >
                Change Password
                </button>

                <button className="logout-button" onClick={handleLogout}>
                Log Out
                </button>
            </div>

            {showPasswordChange && (
                <div className="password-change-form">
                <div className="form-group">
                    <label>Current Password</label>
                    <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <button className="save-button" onClick={handleChangePassword}>
                     {changesLoading? 'Updating...' : "Update Password"}
                </button>
                </div>
            )}
            </div>

      </div>
    </div>
  );
};

export default UserProfile;
