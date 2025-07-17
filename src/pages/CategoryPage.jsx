// Create a new component CategoryPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FoodList from '../components/FoodList';
import { toast } from 'sonner';
import axios from 'axios';

function CategoryPage() {
  const { category } = useParams();
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_BASE_URL
  
 useEffect(() => {
  const fetchFoodsByCategory = async () => {
    try {
      const response = await axios.get(`${baseUrl}/food?category=${category}&?cb=${Date.now()}`);
      const data = response.data;
      console.log(data.foods);

      if (response.status === 200) {
        setFoods(data.foods);
      } 
    } catch (error) {
      console.error('Error fetching foods:', error);
      if (error.response) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Network or server error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchFoodsByCategory();
}, [baseUrl, category]);


  return (
    <div className="container-home">
      <h1>{category} Foods</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <FoodList foods={foods} />
      )}
    </div>
  );
}

export default CategoryPage;