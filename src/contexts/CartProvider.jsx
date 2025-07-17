import {  useState, } from 'react';
import { toast } from 'sonner';
import { CartContext } from './cartContex';
// import axios from 'axios';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [cartIsLoading, setCartIsLoading] = useState(false);
  const [isWishListLoading, setIsWishListLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const addToCart = async (foodData) => {
    console.log(foodData);
    
    try {
      setCartIsLoading(true);
      if(!foodData){
        toast.error("Product data is Required")
        return;
      }
      
      const user = JSON.parse(localStorage.getItem('user'))
      
      if(user.role !== "buyer"){
        toast.error('you must be a buyer before adding item to cart')
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error("You must be logged in to add items to the cart");
        return;
      }

      const userId = JSON.parse(localStorage.getItem('user'))._id

      const response = await fetch(`${baseUrl}/cart/${userId}`, {
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
        return;
      }
      const userId = JSON.parse(localStorage.getItem('user'))?._id;
      const response = await fetch(`${baseUrl}/cart/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      

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


      const response = await fetch(`${baseUrl}/cart/${productId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
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

// WishList
  const addToWishList = async (foodData) => {
    console.log(foodData);
    
    try {
      setIsWishListLoading(true);
      if(!foodData){
        toast.error("Product data is Required")
        return;
      }
      
      const user = JSON.parse(localStorage.getItem('user'))
      
      if(user.role !== "buyer"){
        toast.error('you must be a buyer before adding item to wishList')
        return;
      }

      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error("You must be logged in to add items to wishList");
        return;
      }

      const userId = JSON.parse(localStorage.getItem('user'))._id

      const response = await fetch(`${baseUrl}/wishList/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(foodData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to wishList');
      }
      
      console.log(response);
      

      setWishList(data);
      setTimeout(() => {
        toast.success(`Item added to wishList`);
      }, 1000);
      // return data.data;
      
    } catch (error) {
      toast.error(error.message);
      console.log(error);      
    } finally {
      setTimeout(() => {
        setIsWishListLoading(false);
      }, 1000);
    }
  };
  
  const fetchWishList = async () => {
    try {
      setIsWishListLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return;
      }
      const userId = JSON.parse(localStorage.getItem('user'))?._id;
      const response = await fetch(`${baseUrl}/wishList/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      

      const data = await response.json();
      setWishList(data.wishList);
      console.log('wishList fetched successfully:', data);
    } catch (error) {
      toast.error(error.message);
      console.error('Error fetching wishList:', error);
    } finally {
      setIsWishListLoading(false);
    }
  }

  const updateWishList = async (wishListField, item) => {
    
    // console.log(item);
    
    try {
      setIsWishListLoading(true);
      if(!wishListField){
        toast.error("Updated data is Required")
        return;
      }
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error("You must be logged in to add items to the cart");
        return;
      }

      const response = await fetch(`${baseUrl}/wishList/${item}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(wishListField)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update wishList');
      }
      
      console.log(response);
      

      setWishList(data);
      setTimeout(() => {
        toast.success(`wishList updated successfully`);
      }, 1000);
      // return data.data;
      
    } catch (error) {
      toast.error(error.message);
      console.log(error);            
    } finally {
      setTimeout(() => {
        setIsWishListLoading(false);
      }, 1000);
    }
  };

  const deleteWishList = async (productId) => {
    
    console.log(productId);
    
    try {
      setIsWishListLoading(true);
      if(!productId){
        toast.error("Updated data is Required")
        return;
      }


      const response = await fetch(`${baseUrl}/wishList/${productId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
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
        setIsWishListLoading(false);
      }, 1000);
    }
  };


  const cartContextValue = {
    cart,
    wishList,
    cartIsLoading,
    setCartIsLoading,
    fetchCart,
    updateCart,
    deleteCart,
    addToCart,
    
    isWishListLoading,
    fetchWishList,
    updateWishList,
    deleteWishList,
    addToWishList,
  };
  // Other cart operations (fetchCart, updateQuantity, removeItem, etc.)
  // ...

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
