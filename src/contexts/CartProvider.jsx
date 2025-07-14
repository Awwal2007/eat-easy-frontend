import {  useState, } from 'react';
import { toast } from 'sonner';
import { CartContext } from './cartContex';
// import axios from 'axios';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [headerData, setHeaderData] = useState(null);
  const [cartIsLoading, setCartIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const addToCart = async (foodData) => {
    console.log(foodData);
    
    try {
      setCartIsLoading(true);
      if(!foodData){
        toast.error("Product data is Required")
        return;
      }
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error("You must be logged in to add items to the cart");
        return;
      }

      const response = await fetch(`${baseUrl}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(foodData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }
      
      console.log(response);
      

      setCart(data);
      setTimeout(() => {
        toast.success(`Item added to cart`);
      }, 1000);
      // return data.data;
      
    } catch (error) {
      toast.error(error.message);
      console.log(error);      
    } finally {
      setTimeout(() => {
        setCartIsLoading(false);
      }, 1000);
    }
  };
  
  const fetchCart = async () => {
    try {
      setCartIsLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error("You must be logged in to view the cart");
        return;
      }

      const response = await fetch(`${baseUrl}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCart(data.cartList);
      console.log('Cart fetched successfully:', data);
    } catch (error) {
      toast.error(error.message);
      console.error('Error fetching cart:', error);
    } finally {
      setCartIsLoading(false);
    }
  }

  const updateCart = async (cartField, item) => {
    
    console.log(item);
    
    try {
      setCartIsLoading(true);
      if(!cartField){
        toast.error("Updated data is Required")
        return;
      }
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error("You must be logged in to add items to the cart");
        return;
      }

      const response = await fetch(`${baseUrl}/cart/${item}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(cartField)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart');
      }
      
      console.log(response);
      

      setCart(data);
      setTimeout(() => {
        toast.success(`Cart updated successfully`);
      }, 1000);
      // return data.data;
      
    } catch (error) {
      toast.error(error.message);
      console.log(error);            
    } finally {
      setTimeout(() => {
        setCartIsLoading(false);
      }, 1000);
    }
  };

  const deleteCart = async (productId) => {
    
    console.log(productId);
    
    try {
      setCartIsLoading(true);
      if(!productId){
        toast.error("Updated data is Required")
        return;
      }
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error("You must be logged in to add items to the cart");
        return;
      }

      const response = await fetch(`${baseUrl}/cart/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart');
      }
      
      console.log(data.message);
      

      
      setTimeout(() => {
        toast.success(`${data.message}`);
      }, 1000);
      // return data.data;
      
    } catch (error) {
      toast.error(error.message);
      console.log(error);            
    } finally {
      setTimeout(() => {
        setCartIsLoading(false);
      }, 1000);
    }
  };


  const cartContextValue = {
    cart,
    addToCart,
    cartIsLoading,
    setCartIsLoading,
    fetchCart,
    updateCart,
    deleteCart,
    headerData,
    setHeaderData
  };
  // Other cart operations (fetchCart, updateQuantity, removeItem, etc.)
  // ...

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
