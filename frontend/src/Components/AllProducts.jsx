import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productService } from "../services/api";

// Add this constant at the top of the file, after the imports
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAll();
        console.log("Full API Response:", response);
        console.log("Products data:", response.data);
        if (response.data.length > 0) {
          console.log("First product complete data:", response.data[0]);
          console.log("First product image fields:", {
            image_url: response.data[0].image_url,
            img: response.data[0].img,
            image: response.data[0].image,
            allKeys: Object.keys(response.data[0]),
          });
        }
        setProducts(response.data);
        setError(null);

        // Log the first product to see its structure
        if (response.data.length > 0) {
          console.log("First product structure:", response.data[0]);
        }

        const categoryFromUrl = searchParams.get("category");
        if (categoryFromUrl) {
          setSelectedCategory(categoryFromUrl);
          const filtered = response.data.filter(
            (product) => product.category === categoryFromUrl
          );
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(response.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle URL parameters changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      const filtered = products.filter(
        (product) => product.category === categoryFromUrl
      );
      setFilteredProducts(filtered);
    } else {
      setSelectedCategory("All");
      setFilteredProducts(products);
    }
  }, [searchParams, products]);

  // Get unique categories
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filter products by category
  const filterProducts = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === category
      );
      setFilteredProducts(filtered);
    }
  };

  // Sort products
// Ensure Add to Cart is always shown, not Out of Stock.
// (If you have logic like: if (product.stock === 0) show 'Out of Stock', remove/replace it to always show Add to Cart)
// Example of rendering (update your render logic accordingly):
// <button onClick={() => handleAddToCart(product)} className="bg-green-500 ...">Add to Cart</button>
// Remove any conditional rendering that disables this button based on stock.

  const sortProducts = (sortType) => {
    setSortBy(sortType);
    const sorted = [...filteredProducts];
    switch (sortType) {
      case "price-low":
        sorted.sort(
          (a, b) =>
            parseFloat(a.price.replace("$", "")) -
            parseFloat(b.price.replace("$", ""))
        );
        break;
      case "price-high":
        sorted.sort(
          (a, b) =>
            parseFloat(b.price.replace("$", "")) -
            parseFloat(a.price.replace("$", ""))
        );
        break;
      case "rating":
        sorted.sort((a, b) => {
          const ratingA = parseInt(a.rating.split("(")[1]);
          const ratingB = parseInt(b.rating.split("(")[1]);
          return ratingB - ratingA;
        });
        break;
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredProducts(sorted);
  };

  // Add to cart handler
  const handleAddToCart = (product) => {
    // Format the product data to match the expected structure
    const formattedProduct = {
      id: product._id || product.name, // Use _id if available, otherwise use name as id
      name: product.name,
      price:
        typeof product.price === "string" ? product.price : `$${product.price}`,
      image_url: product.image_url || product.img || product.image[0],
      quantity: 1,
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

    // Remove alert after 3 seconds
    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.transform = "translateY(-100%)";
      setTimeout(() => {
        document.body.removeChild(alert);
      }, 500);
    }, 3000);
  };

  // Add this helper function after the imports
  const getImageUrl = (product) => {
    // Try different possible image field names
    const imageUrl =
      product.image_url || product.img || (product.image && product.image[0]);
    console.log("Getting image URL for product:", {
      name: product.name,
      imageUrl,
      product,
    });
    return imageUrl || PLACEHOLDER_IMAGE;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {selectedCategory === "All"
            ? "All Products"
            : `${selectedCategory} Products`}
        </h1>
        <p className="text-gray-600">Discover our wide range of products</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center w-full h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <>
          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-4 mb-8 w-full max-w-3xl">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedCategory}
                onChange={(e) => filterProducts(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={sortBy}
                onChange={(e) => sortProducts(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                // Log each product's ID before rendering
                console.log("Product ID for navigation:", {
                  id: product.id,
                  _id: product._id,
                  name: product.name,
                });

                return (
                  <div
                    key={product.id || product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col cursor-pointer"
                    onClick={() => {
                      const productId = product.id || product._id;
                      console.log("Navigating to product:", productId);
                      if (productId) {
                        navigate(`/products/${productId}`);
                      } else {
                        console.error("No product ID found:", product);
                      }
                    }}
                  >
                    <div className="h-48 flex items-center justify-center bg-gray-100">
                      <img
                        src={getImageUrl(product)}
                        alt={product.name}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          console.log(
                            "Image load error for product:",
                            product.name
                          );
                          e.target.onerror = null;
                          e.target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                        {product.name}
                      </h3>

                      {/* Price and Rating */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-green-600">
                          {product.price}
                        </span>
                        {product.rating && (
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="text-sm text-gray-600">
                              {product.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {product.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Stock Status */}
                      {/* Stock status removed as per user request */}

                      {/* About Product List */}
                      {product.about_product && Array.isArray(product.about_product) && product.about_product.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-semibold mb-1 text-sm">Product Details:</h4>
                          <ul className="list-disc list-inside text-xs text-gray-700">
                            {product.about_product.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Category */}
                      {product.category && (
                        <div className="mb-3">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                        </div>
                      )}

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation when clicking the button
                          handleAddToCart(product);
                        }}
                        className="w-full py-2 px-4 rounded-md transition-colors duration-300 bg-green-500 hover:bg-green-600 text-white"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                No products found in this category.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
