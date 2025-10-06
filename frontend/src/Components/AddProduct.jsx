import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [aboutProduct, setAboutProduct] = useState("");
  const [stock, setStock] = useState("");
  const [rating, setRating] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("original_price", originalPrice);
    formData.append("category", category);
    formData.append("about_product", aboutProduct);
    formData.append("stock", stock);
    formData.append("rating", rating);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to create product");
      setSuccess("Product created successfully!");
      setTimeout(() => {
        navigate("/all-products"); // Change this path if your route is different
      }, 1000);
      // Optionally reset form fields here
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: 500, margin: "2rem auto" }}
    >
      <h2>Add Product</h2>
      {/* Out of Stock UI removed as per user request */}
      <div>
        <label>Product Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>
      <div>
        <label>Product Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Product Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Price</label>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          required
        />
      </div>
      <div>
        <label>Original Price</label>
        <input
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          type="number"
        />
      </div>
      <div>
        <label>Category</label>
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div>
        <label>About Product</label>
        <input
          value={aboutProduct}
          onChange={(e) => setAboutProduct(e.target.value)}
        />
      </div>
      <div>
        <label>Stock</label>
        <input
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          type="number"
          required
        />
      </div>
      <div>
        <label>Rating</label>
        <input value={rating} onChange={(e) => setRating(e.target.value)} />
      </div>
      <button type="submit">Add Product</button>
      {success && <div style={{ color: "green" }}>{success}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
