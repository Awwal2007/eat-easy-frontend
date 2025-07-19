import { useState, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiStar } from 'react-icons/fi';
import { 
  GiChopsticks, 
  GiBarbecue, 
  GiSlicedBread, 
  GiHamburger,
  GiCakeSlice,
  GiCoffeeCup,
  GiIndiaGate,
  GiTacos,
  GiCupcake,
  GiFullPizza,
  GiOpenedFoodCan,
  GiSandwich,
  GiFishCooked,
  GiPlantRoots
} from 'react-icons/gi';
import { FaMotorcycle, FaClock, FaStoreAlt } from 'react-icons/fa';
import './css/Home.css';
import logo from "../assets/eat-easy logo head.png";
import heroImg from "../assets/delivary-man-png.png";
// import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const topRatedFoods = [...allProducts]
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 4);

  const latestFoods = [...allProducts]
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 4)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all products
        const productsResponse = await axios.get(`${baseUrl}/food`);
        const productsData =  productsResponse.data;
        if (productsData.status !== "success") {
          throw new Error(`Failed to fetch products: ${productsResponse.status}`);
        }
        
        console.log(productsResponse);
        
        setAllProducts(Array.isArray(productsData) ? productsData : productsData.foods || []);

        // Fetch nearby restaurants (replace with your actual endpoint)
        const restaurantsResponse = await fetch(`${baseUrl}/restaurants`);
        if (!restaurantsResponse.ok) {
          throw new Error(`Failed to fetch restaurants: ${restaurantsResponse.status}`);
        }
        const restaurantsData = await restaurantsResponse.json();
        setNearbyRestaurants(Array.isArray(restaurantsData) ? restaurantsData : restaurantsData.restaurants || []);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        // toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [baseUrl]);

  return (
    <div className="app">
      {/* Header can be added here */}

      {/* Hero Section */}
      <section className="hero">
        <div className="container-home">
          <div className="hero-content">
            <div className="hero-text">
              <h2>Delicious food delivered to your doorstep</h2>
              <p>Order from your favorite restaurants with just a few taps</p>
              <div className="hero-search">
                <input type="text" placeholder="Enter your delivery address..." />
                <button className="search-btn">Find Food</button>
              </div>
            </div>
            <div className="hero-image">
              <img src={heroImg} alt="Food delivery" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container-home">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(254, 114, 76, 0.1)' }}>
                <FaMotorcycle style={{ color: 'var(--Second-color)' }} />
              </div>
              <h3>Fast Delivery</h3>
              <p>Get your food delivered in under 30 minutes</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(255, 197, 41, 0.1)' }}>
                <FaStoreAlt style={{ color: 'var(--Primary-color)' }} />
              </div>
              <h3>100+ Restaurants</h3>
              <p>Choose from a wide variety of cuisines</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(254, 114, 76, 0.1)' }}>
                <FaClock style={{ color: 'var(--Second-color)' }} />
              </div>
              <h3>24/7 Support</h3>
              <p>We're always here to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Categories Section */}
      <section className="food-categories">
        <div className="container-home">
          <h2>Food Categories</h2>
          <div className="categories-grid">
            {[
              { name: 'Asian', icon: <GiChopsticks /> },
              { name: 'BBQ', icon: <GiBarbecue /> },
              { name: 'Breakfast', icon: <GiSlicedBread /> },
              { name: 'Burger', icon: <GiHamburger /> },
              { name: 'Dessert', icon: <GiCakeSlice /> },
              { name: 'Drink', icon: <GiCoffeeCup /> },
              { name: 'Indian', icon: <GiIndiaGate /> },
              { name: 'Mexican', icon: <GiTacos /> },
              { name: 'Pasta', icon: <GiCupcake /> },
              { name: 'Pizza', icon: <GiFullPizza /> },
              { name: 'Salad', icon: <GiOpenedFoodCan /> },
              { name: 'Sandwich', icon: <GiSandwich /> },
              { name: 'Seafood', icon: <GiFishCooked /> },
              { name: 'Vegan', icon: <GiPlantRoots /> }
            ].map((category) => (
              <button 
                key={category.name}
                className="category-btn"
                onClick={() => navigate(`/category/${category.name}`)}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Foods Section */}
      <section className="popular-foods">
        <div className="container-home">
          <div className="section-header">
            <h2>Popular Foods</h2>
            <Link to='/all-product' className="view-all">View All</Link>
          </div>
          
          {error ? (
            <div className="error-message">{error}</div>
          ) : isLoading ? (
            <div className="loading">Loading...</div>
          ) : topRatedFoods.length > 0 ? (
            <div className="foods-grid">
              {topRatedFoods.map(food => (
                  <div onClick={()=> navigate(`/product/${food._id}`)} className="food-card" key={food._id}>
                    <div className="food-image">
                      <img 
                        src={food.image} 
                        alt={food.title} 
                        onError={(e) => {
                          e.target.src = '/default-food.jpg';
                        }}
                      />
                      <div className="food-badge">
                        {'★'.repeat(Math.round(food.rating || 0))}
                        {'☆'.repeat(5 - Math.round(food.rating || 0))}
                        <span>{food.rating || '0.0'}</span>
                      </div>
                    </div>
                    <div className="food-info">
                      <h3>{food.title || 'Unnamed Item'}</h3>
                      <div className="food-meta">
                        <span className="food-price">
                          ${typeof food.price === 'number' ? food.price.toFixed(2) : '0.00'}
                        </span>
                        <span className="food-time">
                          <FaClock /> {food.prepTime || '15-20'} min
                        </span>
                      </div>
                      <span>Res: {food?.user?.restaurantName}</span>
                      <br />
                      <br />
                      <Link style={{textDecoration: "none"}} to={`/product/${food._id}`}>
                        <button className="add-to-cart">View Details</button>                    
                      </Link>
                    </div>
                  </div>
              ))}
            </div>
          ) : (
            <div className="no-results">No food items available</div>
          )}
        </div>
      </section>

      {/* Latest Foods Section */}
      <section className="popular-foods">
        <div className="container-home">
          <div className="section-header">
            <h2>Latest Foods</h2>
            <Link to='/all-product' className="view-all">View All</Link>
          </div>
          
          {error ? (
            <div className="error-message">{error}</div>
          ) : isLoading ? (
            <div className="loading">Loading...</div>
          ) : latestFoods.length > 0 ? (
            <div className="foods-grid">
              {latestFoods.map(food => (
                  <div onClick={()=> navigate(`/product/${food._id}`)} className="food-card" key={food._id}>
                    <div className="food-image">
                      <img 
                        src={food.image} 
                        alt={food.title} 
                        onError={(e) => {
                          e.target.src = '/default-food.jpg';
                        }}
                      />
                      <div className="food-badge">
                        {'★'.repeat(Math.round(food.rating || 0))}
                        {'☆'.repeat(5 - Math.round(food.rating || 0))}
                        <span>{food.rating || '0.0'}</span>
                      </div>
                    </div>
                    <div className="food-info">
                      <h3>{food.title || 'Unnamed Item'}</h3>
                      <div className="food-meta">
                        <span className="food-price">
                          ${typeof food.price === 'number' ? food.price.toFixed(2) : '0.00'}
                        </span>
                        <span className="food-time">
                          <FaClock /> {food.prepTime || '15-20'} min
                        </span>
                      </div>
                      <span>Res: {food?.user?.restaurantName}</span>
                      <br />
                      <br />
                      <Link style={{textDecoration: "none"}} to={`/product/${food._id}`}>
                        <button className="add-to-cart">View Details</button>                    
                      </Link>
                    </div>
                  </div>
              ))}
            </div>
          ) : (
            <div className="no-results">No food items available</div>
          )}
        </div>
      </section>

      {/* Nearby Restaurants Section */}
      <section className="nearby-restaurants">
        <div className="container-home">
          <div className="section-header">
            <h2>Nearby Restaurants</h2>
            <a href="#" className="view-all">View All</a>
          </div>
          
          {error ? (
            <div className="error-message">{error}</div>
          ) : isLoading ? (
            <div className="loading">Loading...</div>
          ) : nearbyRestaurants.length > 0 ? (
            <div className="restaurants-grid">
              {nearbyRestaurants.map(restaurant => (
                <div className="restaurant-card" key={restaurant.id || restaurant._id}>
                  <div className="restaurant-image">
                    <img 
                      src={restaurant.image || '/default-restaurant.jpg'} 
                      alt={restaurant.name || 'Restaurant'} 
                      onError={(e) => {
                        e.target.src = '/default-restaurant.jpg';
                      }}
                    />
                  </div>
                  <div className="restaurant-info">
                    <h3>{restaurant.name || 'Unnamed Restaurant'}</h3>
                    <div className="restaurant-meta">
                      <span className="restaurant-rating">
                        <FiStar className="star-icon" /> {restaurant.rating || '0.0'}
                      </span>
                      <span className="delivery-time">
                        <FaMotorcycle /> {restaurant.deliveryTime || '20-30 min'}
                      </span>
                    </div>
                    <button className="view-menu">View Menu</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">No nearby restaurants available</div>
          )}
        </div>
      </section>

      {/* App Download Section */}
      <section className="app-download">
        <div className="container-home">
          <div className="app-content">
            <div className="app-text">
              <h2>Download Our Mobile App</h2>
              <p>Get exclusive offers and easy ordering with our app</p>
              <div className="app-buttons">
                <button className="app-store">
                  <img src="/app-store.png" alt="App Store" />
                </button>
                <button className="play-store">
                  <img src="/play-store.png" alt="Play Store" />
                </button>
              </div>
            </div>
            <div className="app-image">
              <img src="/app-screens.png" alt="App Screens" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container-home">
          <div className="footer-content">
            <div className="footer-about">
              <div className="logo">
                <img style={{background: 'white'}} height={"70px"} src={logo} alt="EatEasy Logo" />
              </div>
              <p>Delivering happiness to your doorstep since 2020</p>
              <div className="social-links">
                <a href="#"><img src="/facebook.png" alt="Facebook" /></a>
                <a href="#"><img src="/twitter.png" alt="Twitter" /></a>
                <a href="#"><img src="/instagram.png" alt="Instagram" /></a>
              </div>
            </div>
            
            <div className="footer-links">
              <h3>Company</h3>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h3>Support</h3>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
            
            <div className="footer-newsletter">
              <h3>Newsletter</h3>
              <p>Subscribe to get updates on new offers</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email address" />
                <button>Subscribe</button>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} EatEasy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;