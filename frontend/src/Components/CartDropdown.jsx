import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDropdown({ isOpen, onClose }) {
  const { cartItems, removeFromCart } = useCart();
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => {
        const price =
          typeof item.price === "string"
            ? parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
            : item.price;
        return sum + price * (item.quantity || 1);
      }, 0)
      .toFixed(2);
  };

  const handleProductClick = (product) => {
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

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Shopping Cart</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800">
                      {item.name}
                    </h4>
                    <p className="text-sm text-green-600 font-semibold">
                      {item.price}
                    </p>
                    <p className="text-xs text-gray-500">
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Total:</span>
              <span className="text-lg font-semibold text-green-600">
                ${calculateTotal()}
              </span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
