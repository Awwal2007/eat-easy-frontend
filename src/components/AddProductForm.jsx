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
        productImage: null,
        prepTime: "5",
        category: "Asian",
        createdBy: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const baseUrl = import.meta.env.VITE_BASE_URL;

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
        //validation
        if (!addProductFormData.title || !addProductFormData.price || !addProductFormData.productImage) {
            toast.error("Please fill in all required fields");
            setIsSubmitting(false);
            return;
        }

        const maxSizeInBytes = 1.1 * 1024 * 1024;

        if (addProductFormData.productImage.size > maxSizeInBytes) {
            toast.error("File size exceeds 1.1MB. Please choose a smaller image.");
            setIsSubmitting(false) // Reset file input
            return;
        }

        const token = localStorage.getItem('sellerToken');
        if (!token) {
            toast.error("Please login to add products");
            setIsSubmitting(false);
            return;
        }

        const userId = JSON.parse(localStorage.getItem('sellerData'))?._id

        const formData = new FormData();
        formData.append("title", addProductFormData.title);
        formData.append("price", addProductFormData.price);
        formData.append("rating", addProductFormData.rating || 1);
        formData.append("description", addProductFormData.description || "");
        formData.append("productImage", addProductFormData.productImage);
        formData.append("prepTime", addProductFormData.prepTime);
        formData.append("category", addProductFormData.category);
        formData.append("user", userId);

        try {
            const res = await fetch(`${baseUrl}/food`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const text = await res.text();
            let responseData;

            try {
                responseData = JSON.parse(text);
            } catch {
                console.error("Received HTML response:", text);
                throw new Error("Server returned an error page. Please check the API endpoint.");
            }

            if (!res.ok) {
                throw new Error(responseData.message || `Request failed with status ${res.status}`);
            }

            toast.success(responseData.message);
            navigate("/seller-dashboard");
            setAddProductFormData({
                title: "",
                price: "",
                rating: 1,
                description: "",
                productImage: null,
                prepTime: "5",
                category: "Asian"
            });
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const categoryOptions = [
        "Asian", "BBQ", "Breakfast", "Burger", "Dessert", "Drink",
        "Indian", "Mexican", "Pasta", "Pizza", "Salad", "Sandwich", "Seafood", "Vegan"
    ];

    const prepTimeOptions = ["5", "10", "15", "20", "30", "45", "60"];

    return (
        <form onSubmit={handleSubmit} className="product-form">
            <div>
                <button onClick={()=> navigate(-1)} style={{fontSize: "12px", padding: "7px 20px", background: "blue", border: "none", color: "white", cursor: "pointer"}}> -- Go Back</button>
            </div>
            <h2 style={{textAlign: "center"}}>Add New Product</h2>

            <div className="form-group">
                <label htmlFor="title">Title*</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="E.g, Iced Tea..."
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
                    value={addProductFormData.rating}
                    onChange={handleChange}
                    required
                    min="1"
                    max="5"
                    step="0.01"
                />
            </div>

            <div className="form-group">
                <label htmlFor="prepTime">Prep Time (mins)</label>
                <select
                    id="prepTime"
                    name="prepTime"
                    value={addProductFormData.prepTime}
                    onChange={handleChange}
                >
                    {prepTimeOptions.map(time => (
                        <option key={time} value={time}>
                            {time === "60" ? "1 hour" : `${time} minutes`}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    name="category"
                    value={addProductFormData.category}
                    onChange={handleChange}
                >
                    {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
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
                <label htmlFor="image">Food Image*</label>
                <div style={{fontSize: "12px"}}>max image size: 1.1mb</div>
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
                        <p>Selected: {addProductFormData.productImage.name}</p>
                        <img style={{ height: "100px" }} src={URL.createObjectURL(addProductFormData.productImage)} alt="Preview" />
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
