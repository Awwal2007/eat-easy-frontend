import { useState } from 'react'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import './css/SellerLogin.css'


const SellerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loggingIn, setLoggingIn] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoggingIn(true);
    try {
      const response = await fetch(`${baseUrl}/seller/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        
        
        toast.success("Login successful");
        // Store token and user data
        localStorage.setItem("sellerToken", data.accessToken);
        // localStorage.setItem("sellerData", JSON.stringify(data.user));
        navigate("/seller-dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="seller-login-container">
      <div className="seller-login-card">
        <div className="login-header">
          <h2>Seller Login</h2>
          <p>Access your restaurant dashboard</p>
        </div>
        
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group`}>
            <label htmlFor="email">
              <FiMail /> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              placeholder="your@email.com"
              autoComplete="username"
            />
          </div>
          
          <div className={`form-group`}>
            <label htmlFor="password">
              <FiLock /> Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInput}
              placeholder="Enter your password"

            />
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            
            <Link to="/seller/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            className="login-btn"
            disabled={loggingIn}
          >
            {loggingIn ? 'Logging in...' : (
              <>
                <FiLogIn /> Login
              </>
            )}
          </button>
          
          <div className="signup-link">
            Don't have an account? <Link to="/seller-signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellerLogin