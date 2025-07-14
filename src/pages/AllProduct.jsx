import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
// import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiStar } from 'react-icons/fi';
import { FaMotorcycle, FaClock, FaStoreAlt } from 'react-icons/fa';



const AllProduct = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
   
    const baseUrl = import.meta.env.VITE_BASE_URL;


    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Fetch all products
                const productsResponse = await fetch(`${baseUrl}/food`);
                if (!productsResponse.ok) {
                    throw new Error(`Failed to fetch products: ${productsResponse.status}`);
                }
                const productsData = await productsResponse.json();
                console.log(productsData);
                
                setAllProducts(Array.isArray(productsData) ? productsData : productsData.foods || []);


            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                toast.error('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };
       
        fetchData();
    }, [baseUrl]);
  return (
    <section className="popular-foods">
            <div className="container-home">
              <div className="section-header">
                <h2>All Foods</h2>
              </div>
              
              {error ? (
                <div className="error-message">{error}</div>
              ) : isLoading ? (
                <div className="loading">Loading...</div>
              ) : allProducts.length > 0 ? (
                <div className="foods-grid">
                  {allProducts.map(food => (
                    <div className="food-card" key={food._id}>
                      <div className="food-image">
                        <img 
                          src={food.image || '/default-food.jpg'} 
                          alt={food.title || 'Food item'} 
                          onError={(e) => {
                            e.target.src = '/default-food.jpg';
                          }}
                        />
                        <div className="food-badge">
                          <p className="star-icon">
                            {'★'.repeat(Math.round(food.rating || 0))}
                            {'☆'.repeat(5 - Math.round(food.rating || 0))}
                          </p>
                          <p>{food.rating}</p>
                        </div>
                      </div>
                      <div className="food-info">
                        <h3>{food.title || 'Unnamed Item'}</h3>
                        <div className="food-meta">
                          <span className="food-price">
                            ${typeof food.price === 'number' ? food.price.toFixed(2) : '0.00'}
                          </span>
                          <span className="food-time">
                            <FaClock /> {food.prepTime || '15-20 min'}
                          </span>
                        </div>
                        <Link to={`/product/${food._id}`}>
                          <button style={{marginTop: "10px"}} className="view-menu">More Details</button>
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
  )
}

export default AllProduct