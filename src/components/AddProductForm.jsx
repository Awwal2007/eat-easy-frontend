import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import "./css/AddProductForm.css";

const AddProductForm = () => {
    const [addProductFormData, setAddProductFormData] = useState({
        title: "",
        price: "",
        description: "",
        rating: 1,
        productImage: null
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const baseUrl = import.meta.env.VITE_BASE_URL; // Fixed environment variable access

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        
        setAddProductFormData(prev => ({
            ...prev,
            [name]: name === "productImage" ? files[0] : value
        }));
    };
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation
        if (!addProductFormData.title || !addProductFormData.price || !addProductFormData.productImage) {
            toast.error("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }

        const token = localStorage.getItem('sellerToken'); // Adjust based on your token storage
        if (!token) {
            toast.error("Please login to add products");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        
        formData.append("title", addProductFormData.title);
        formData.append("price", addProductFormData.price);
        formData.append("rating", addProductFormData.rating || 1);
        formData.append("description", addProductFormData.description || ""); // Ensure description is sent even if empty
        formData.append("productImage", addProductFormData.productImage);

        try {
            const res = await fetch(`${baseUrl}/food`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
                // credentials: 'include' // Uncomment if using cookies
            });

            const text = await res.text();
            let responseData;
            
            try {
                responseData = JSON.parse(text); // Try to parse as JSON
            } catch {
                // If parsing fails, it's probably HTML
                console.error("Received HTML response:", text);
                throw new Error("Server returned an error page. Please check the API endpoint.");
            }

            if (!res.ok) {
                throw new Error(responseData.message || `Request failed with status ${res.status}`);
            }

            toast.success("Product added successfully!");
            navigate("/seller-dashboard")
            setAddProductFormData({
                title: "",
                price: "",
                rating: "",
                description: "",
                productImage: null
            });
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <h2>Add New Product</h2>

            <div className="form-group">
                <label htmlFor="title">Title*</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="E.g, Nike shoe..."
                    value={addProductFormData.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="price">Price*</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="5000"
                    value={addProductFormData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                />
            </div>

            <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <input
                    type="number"
                    id="rating"
                    name="rating"
                    placeholder="5000"
                    value={addProductFormData.rating}
                    onChange={handleChange}
                    required
                    min="1"
                    max="5"
                    step="1"
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Product description..."
                    value={addProductFormData.description}
                    onChange={handleChange}
                    rows="4"
                />
            </div>

            <div className="form-group">
                <label htmlFor="image">Product Image*</label>
                <input
                    type="file"
                    id="productImage"
                    name="productImage"
                    accept="image/*"
                    onChange={handleChange}
                    required
                />
                {addProductFormData.productImage && (
                    <div className="image-preview">
                        <p>Selected: {addProductFormData.productImage.files}</p>
                        <img style={{height: "100px"}} src={URL.createObjectURL(addProductFormData.productImage)} alt="" />
                    </div>
                )}
            </div>

            <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
        </form>
    );
};

export default AddProductForm;