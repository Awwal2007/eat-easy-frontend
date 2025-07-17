// import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
// import { toast } from 'sonner';
// import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiStar } from 'react-icons/fi';
import { FaMotorcycle, FaClock, FaStoreAlt } from 'react-icons/fa';
import './css/FoodList.css'



const FoodList = ({foods}) => {
  return (
    <section className="popular-foods">
            <div className="container-home">              
              {foods.length > 0 ? (
                <div className="foods-grid">
                  {foods.map(food => (
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

export default FoodList