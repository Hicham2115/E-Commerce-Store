import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../services/api";
import { useCart } from "../context/CartContext";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("Fetching product with ID:", id);

        if (!id) {
          throw new Error("No product ID provided");
        }

        const response = await productService.getById(id);
        console.log("API Response:", response);
        console.log("Product image URL:", response.data?.image_url);

        if (!response.data) {
          throw new Error("No product data received");
        }

        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error("Detailed error:", {
          message: err.message,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data,
          id: id,
        });

        let errorMessage = "Failed to load product details. ";
        if (err.response) {
          errorMessage += `Server responded with status ${err.response.status}`;
        } else if (err.request) {
          errorMessage +=
            "No response received from server. Please check if the server is running.";
        } else {
          errorMessage += err.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const formattedProduct = {
      id: product._id,
      name: product.name,
      price:
        typeof product.price === "string" ? product.price : `$${product.price}`,
      image_url: product.image_url,
      quantity: quantity,
    };

    addToCart(formattedProduct);

    // Show success alert
    const alert = document.createElement("div");
    alert.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out z-50";
    alert.innerHTML = `
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        ${product.name} added to cart successfully!
      </div>
    `;
    document.body.appendChild(alert);

    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-100%)";
      setTimeout(() => {
        document.body.removeChild(alert);
      }, 500);
    }, 3000);
  };

  // ...rest of your component

  // In your JSX, display about_product as a list
  // Example (add this where you want the details to appear):
  // {product?.about_product && Array.isArray(product.about_product) && (
  //   <div className="mt-4">
  //     <h3 className="font-semibold mb-2">Product Details:</h3>
  //     <ul className="list-disc list-inside">
  //       {product.about_product.map((item, idx) => (
  //         <li key={idx}>{item}</li>
  //       ))}
  //     </ul>
  //   </div>
  // )}


  const getImageUrl = (product) => {
    // Try different possible image field names
    const imageUrl =
      product.image_url || product.img || (product.image && product.image[0]);
    console.log("Getting image URL for product details:", {
      name: product.name,
      imageUrl,
      product,
    });
    return imageUrl || PLACEHOLDER_IMAGE;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-red-500 text-center p-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center p-4">Product not found</div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center text-gray-600 hover:text-gray-800"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <img
            src={getImageUrl(product)}
            alt={product.name}
            className="w-full h-96 object-contain"
            onError={(e) => {
              console.log(
                "Image load error for product details:",
                product.name
              );
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          {/* Category */}
          {product.category && (
            <div className="mb-4">
              <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
          )}

          {/* Price and Original Price */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-green-600">
              {product.price}
            </span>
            {product.original_price && (
              <span className="text-lg line-through text-gray-400">
                {product.original_price}
              </span>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 mr-1">★</span>
              <span className="text-gray-600">{product.rating}</span>
            </div>
          )}

          {/* About Product */}
          {product.about_product && Array.isArray(product.about_product) && product.about_product.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Product Details
              </h2>
              <ul className="list-disc list-inside text-gray-700">
                {product.about_product.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Stock Status removed as per user request */}

          {/* Quantity Selector and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-gray-700">
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-3 px-6 rounded-md transition-colors duration-300 bg-green-500 hover:bg-green-600 text-white"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
