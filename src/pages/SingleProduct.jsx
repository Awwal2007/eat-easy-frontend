import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../Hooks/useProduct';
import { toast } from 'sonner';
import { useCart } from '../Hooks/useCart';
import { FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';



import './css/SingleProduct.css';

const SingleProduct = () => {
    const { id } = useParams();
    const { 
        singleProduct, 
        getSingleProduct, 
        isLoading,
        error,
        resetProduct
    } = useProduct();

    const { addToCart, cartIsLoading, fetchCart, addToWishList, isWishListLoading, fetchWishList } = useCart();
    let [cartField, setCartField] = useState({});
    let [quantity, setQuantity] = useState();
    const [inputVal, setInputVal] = useState(1);
    // const [cartNumber, setCartNumber] = useState()

    const handleAddToCart = async () => {
        try {
            const product = singleProduct?.food;
            if (!singleProduct) {
                throw new Error('Product information is not available');
            }
            if (!product) {
                throw new Error('Product data is not available');
            }

            const user = JSON.parse(localStorage.getItem('user'))
            const originalUser = user?.userData || user;

            cartField.title = product?.title
            cartField.description = product?.description
            cartField.price = product?.price
            cartField.category = product?.category
            cartField.image = product?.image
            cartField.user = originalUser._id
            cartField.seller = product?.user?.id
            cartField.productId = product?._id
            if (quantity < 1) {
                throw new Error('Quantity must be at least 1');
            }
            cartField.quantity = quantity // Default quantity
            cartField.subTotal = parseInt(product?.price * quantity) 
            cartField.rating = product?.rating
            // cartField.createdBy = originalUser?._id
            console.log(product?.user?.id)

            await addToCart(cartField);
            // toast.success(`${product.title} added to cart successfully`);
            setCartField({});
            setInputVal(1);
            setQuantity(1);
            fetchCart()
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleAddToWishList = async () => {
        try {
            const product = singleProduct?.food;
            if (!singleProduct) {
                throw new Error('Product information is not available');
            }
            if (!product) {
                throw new Error('Product data is not available');
            }

            const user = JSON.parse(localStorage.getItem('user'))
            const originalUser = user?.userData || user;

            cartField.title = product?.title
            cartField.description = product?.description
            cartField.price = product?.price
            cartField.category = product?.category
            cartField.image = product?.image
            cartField.productId = product?._id
            if (quantity < 1) {
                throw new Error('Quantity must be at least 1');
            }
            cartField.quantity = quantity // Default quantity
            cartField.subTotal = parseInt(product?.price * quantity) 
            cartField.rating = product?.rating
            cartField.createdBy = originalUser?._id

            await addToWishList(cartField);
            fetchWishList();
            // toast.success(`${product.title} added to cart successfully`);
            setCartField({});
            setInputVal(1);
            setQuantity(1);
            fetchCart()
        } catch (error) {
            toast.error(error.message);
        }
    };

    const increaseQuantity = () => {
        setInputVal(inputVal + 1);
    };

    const decreaseQuantity = () => {
        if (inputVal !== 1 && inputVal > 1) {
            setInputVal(inputVal - 1);
        }
    };
    useEffect(() => {
        setQuantity(inputVal);
        if (inputVal > 1) {
            setTimeout(() => {
                toast.success(`Quantity set to ${inputVal}`); 
            }, 500);           
        }
        // console.log(`Quantity set to ${inputVal}`);
    }, [inputVal]);

    useEffect(() => {
        if (!id) {
            toast.error('No product ID provided');
            return;
        }

        const fetchProduct = async () => {
            try {
                await getSingleProduct(id);
            } catch (err) {
                toast.error(err.message || 'Failed to load product');
                console.log(err);                
            }
        };

        fetchProduct();

        return () => {
            resetProduct();
        };
    },[]);

    if (isLoading) {
        return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading product details...</p>
        </div>
        );
    }else

    if (error) {
        return (
        <div className="error-container">
            <h2>Error Loading Product</h2>
            <p>{error}</p>
            <button 
            onClick={() => getSingleProduct(id)} 
            className="retry-button"
            >
            Retry
            </button>
        </div>
        );
    }else

    if (!singleProduct || !singleProduct.food) {
    return (
      <div className="not-found-container">
        <h2>Product Not Found</h2>
        <p>The requested product could not be loaded.</p>
      </div>
    );
  }

  
    const { food } = singleProduct;
  return (
    <div className="product-detail-container">
      <div className="product-image-section">
        <img 
          src={food.image} 
          alt={food.title} 
          className="product-image"
        />
      </div>
      
      <div className="product-info-section">
        <h1 className="product-title">{food.title}</h1>
        
        <div className="price-section">
          <span className="current-price">
            ${food.price?.toFixed(2) || '0.00'}
          </span>
          {food.originalPrice && (
            <span className="original-price">
              ${food.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        <div className="rating-section">
          <span className="rating-stars">
            {'★'.repeat(Math.round(food.rating || 0))}
            {'☆'.repeat(5 - Math.round(food.rating || 0))}
          </span>
          <span className="rating-value">
            ({food.rating?.toFixed(1) || '0.0'})
          </span>
        </div>
        
        <p className="product-description">{food.description}</p>
        <p className="product-description">{food?.item?.restaurantName}</p>        
           <div className="quantity-selector">
                <button 
                    className="quantity-btn" 
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                >
                    <FiMinus />
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                    className="quantity-btn" 
                    onClick={increaseQuantity}
                >
                    <FiPlus />
                </button>
            </div>

        <div className="action-buttons">
            <button className="add-to-cart" onClick={handleAddToWishList} disabled={cartIsLoading || !singleProduct?.food?._id}>
               <FavoriteBorderIcon size={20} /> {isWishListLoading ? " Adding..." : " Add to WishList"}
            </button>
            <button className="add-to-cart" onClick={handleAddToCart} disabled={cartIsLoading || !singleProduct?.food?._id}>
               <FiShoppingCart size={20} /> {cartIsLoading ? " Adding..." : " Add to Cart"}
            </button>
          {/* <button className="buy-now">Buy Now</button> */}
        </div>
        
        <div className="product-meta">
          {food.prepTime && (
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span>Prep time: {food.prepTime}</span>
            </div>
          )}
          {food.category && (
            <div className="meta-item">
              <span className="meta-icon">🏷️</span>
              <span>Category: {food.category}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;