import React, {useState, useEffect} from 'react'
import logo from '../assets/eat-easy logo head.png'
// import defaultImage from '../assets/profile-default-svgrepo-com.svg'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiStar } from 'react-icons/fi'
import "./css/Header.css"
import { Link, Navigate } from 'react-router-dom'
// import { toast } from 'sonner'
import { useAuth } from '../Hooks/useAuth'
import { useCart } from '../Hooks/useCart'
import axios from 'axios'
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profile, setProfile] = useState()
  // const [cart, setCart] = useState([])
  const {logout, } = useAuth();
  const {fetchCart, cart} = useCart();
  const token = localStorage.getItem("accessToken");
  // const user = JSON.parse(localStorage.getItem("user"));
  const baseUrl = import.meta.env.VITE_BASE_URL
  
  useEffect(()=>{    
    const fetchUsers = async()=>{
        const user = JSON.parse(localStorage.getItem('user'))
        const userId = user._id;
        try {
            const res = await axios.get(`${baseUrl}/users/${userId}` )
            const data = await res.data;
            const userProfile = data.user.image
            setProfile(userProfile)
            
        } catch (error) {
            console.log(error);            
        }
    };
    fetchUsers()
  },[baseUrl]);

  

  useEffect(() => {

    setTimeout(() => {
      fetchCart();
    },1000);     
  }, []);

  const userLogout = async()=>{
    await logout()
    setTimeout(()=>{
      window.location.reload();
    }, 100)
  }
    
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
            {token ? <Link onClick={()=> userLogout()}>Log Out</Link>:
            <Link to="/signin">Sign In</Link> } 
            <Link to="/seller-signin">Seller</Link>
            <Link to="/wish-list">WishList</Link>
            <Link to="/all-product">Products</Link>
            <button className="close-menu" onClick={() => setIsMenuOpen(false)}>
              <FiX />
            </button>
          </div>
          
          <div className="header-actions">
            {/* <div className="search-box">
              <FiSearch className="search-icon" />
              <input type="text" placeholder="Search food or restaurant..." />
            </div> */}
            
            <Link to="/cart">
              <button className="cart-btn">
                <FiShoppingCart />
                {cart?.length > 0 && (
                  <span className="cart-count">{cart.length}</span>
                )}
              </button>
            </Link>
            
            <Link to='/user-profile' className="user-header-profile">             
              {profile ? <img className='header-profile-img' src={profile} alt="" /> : <FiUser />}
            </Link>
            
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
