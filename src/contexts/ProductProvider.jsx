import { useState } from "react";
import { toast } from "sonner";
import { ProductContext } from "./productContext";
const ProductProvider = ({ children }) => {
    
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [singleProduct, setSingleProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getSingleProduct = async (id) => {
        if (!id) {
            setError("Product ID is required");
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            const res = await fetch(`${baseUrl}/food/${id}`);
            
            if (!res.ok) {
                throw new Error(`Failed to fetch product: ${res.status}`);
            }

            const data = await res.json();
            
            if (!data) {
                throw new Error("Product data is empty");
            }

            setSingleProduct(data);
        } catch (error) {
            console.error("Error fetching product:", error);
            setError(error.message);
            toast.error("Failed to load product details");
            setSingleProduct(null);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        singleProduct,
        isLoading,
        error,
        getSingleProduct,
        resetProduct: () => setSingleProduct(null)
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;