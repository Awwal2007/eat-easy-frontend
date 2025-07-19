import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import './css/SellerMenuPage.css'

const SellerMenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem('sellerToken');

  useEffect(() => {
    const fetchMyFoods = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}/food/admin?page=${page}&limit=${limit}&search=${search}&category=${category}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setFoods(res.data.foods);
        setTotal(res.data.total);
      } catch (error) {
        console.error('Error fetching foods:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyFoods();
  }, [page, limit, search, category]);

  const totalPages = Math.ceil(total / limit);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      <h2>My Foods</h2>

      {/* Filter Controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search foods..."
          value={search}
          onChange={handleSearchChange}
        />
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          <option value="Asian">Asian</option>
          <option value="BBQ">BBQ</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Burger">Burger</option>
          <option value="Dessert">Dessert</option>
          <option value="Drink">Drink</option>
          <option value="Indian">Indian</option>
          <option value="Mexican">Mexican</option>
          <option value="Pasta">Pasta</option>
          <option value="Pizza">Pizza</option>
          <option value="Salad">Salad</option>
          <option value="Sandwich">Sandwich</option>
          <option value="Seafood">Seafood</option>
          <option value="Vegan">Vegan</option>
        </select>
        <button onClick={resetFilters}>Reset</button>
      </div>

      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : foods.length > 0 ? (
        <>
          <div className="foods-grid">
            {foods.map((food) => (
              <div
                onClick={() => navigate(`/product/${food._id}`)}
                className="food-card"
                key={food._id}
              >
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
                  <h3>{food.title}</h3>
                  <div className="food-meta">
                    <span className="food-price">${food.price?.toFixed(2) || '0.00'}</span>
                    <span className="food-time">
                      <FaClock /> {food.prepTime || '15-20'} min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* MUI Pagination */}
          <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
            <Typography>Page: {page} of {totalPages}</Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              variant="outlined"
            />
          </Stack>
        </>
      ) : (
        <p>No foods found.</p>
      )}
    </div>
  );
};

export default SellerMenuPage;
