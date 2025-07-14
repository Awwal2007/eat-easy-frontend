import React, {useState, useEffect} from 'react'
import { jwtDecode } from 'jwt-decode'
import logo from '../assets/eat-easy logo head.png'
// import defaultImage from '../assets/profile-default-svgrepo-com.svg'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiStar } from 'react-icons/fi'
import "./css/Header.css"
import { Link } from 'react-router-dom'
// import { toast } from 'sonner'
import { useAuth } from '../Hooks/useAuth'
import { useCart } from '../Hooks/useCart'
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profile, setProfile] = useState()
  // const [cart, setCart] = useState([])
  const {logout} = useAuth();
  const {fetchCart, cart} = useCart();
  const token = localStorage.getItem("accessToken");
  // const baseUrl = import.meta.env.VITE_BASE_URL
    // const res = await 
    // const profilePicture = ""

  useEffect(()=>{
    
    if(token){
      try {
        const decoded = jwtDecode(token)
        const fullname = decoded.name
        console.log(decoded);
        const [first, last] = fullname.split(" ");
        const userProfile = `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
        
        setProfile(userProfile)
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  },[token]);

  useEffect(() => {
    setTimeout(() => {
      fetchCart();
    },1000);     
  }, []);
    
  return (
    <header className="header">
      <div className="container-home">
        <div className="header-content">
          <div className="logo">
           <Link to="/">
            <img style={{height: "60px", alignSelf: "center"}} src={logo} alt="" />
           </Link>
          </div>
          
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#">Restaurants</a>
            <a href="#">My Orders</a>
            {token ? 
            <Link onClick={logout}>Log Out</Link>
            :
            <Link to="/signup">Sign Up</Link>
            
              }
            <Link to="/seller-signin">Seller</Link>
            <Link to="/all-product">Products</Link>
            <button className="close-menu" onClick={() => setIsMenuOpen(false)}>
              <FiX />
            </button>
          </div>
          
          <div className="header-actions">
            <div className="search-box">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search food or restaurant..." />
            </div>
            
            <Link to="/cart">
              <button className="cart-btn">
                <FiShoppingCart />
                <span className="cart-count">{cart.length || "0"}</span>
              </button>
            </Link>
            
            <button className="user-btn">             
              {profile ? profile : <FiUser />}
            </button>
            
            <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
              <FiMenu />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
