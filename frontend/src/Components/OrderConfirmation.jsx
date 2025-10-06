import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../contexts/OrderContext";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { orders } = useOrders();
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    // Get the most recent order
    if (orders && orders.length > 0) {
      setCurrentOrder(orders[0]); // orders are sorted newest first
    }

    // Clear the cart when the confirmation page is shown
    clearCart();
  }, [clearCart, orders]);

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      // Handle price whether it's a string with $ or a number
      let price;
      if (typeof item.price === "string") {
        // Remove $ and any other non-numeric characters except decimal point
        price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
      } else {
        price = item.price;
      }
      // Multiply by quantity and add to sum
      return sum + price * item.quantity;
    }, 0);
  };

  const subtotal = currentOrder?.subtotal || calculateSubtotal();
  const shipping = currentOrder?.shipping || 5.0;
  const total = currentOrder?.total_amount || subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thank You for Your Order!
            </h1>
            <p className="text-lg text-gray-600">
              Your order has been placed successfully and will be delivered
              soon.
            </p>
            {currentOrder && (
              <p className="text-md text-gray-600 mt-2">
                Order #{currentOrder.id}
              </p>
            )}
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order Details
            </h2>
            <div className="space-y-4">
              {currentOrder &&
                currentOrder.items.map((item) => {
                  const itemTotal = item.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          ${itemTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-800">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-semibold text-lg">
                <span className="text-gray-800">Total:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
