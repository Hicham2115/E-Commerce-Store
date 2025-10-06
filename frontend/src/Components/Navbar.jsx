import cart from "../assets/cart.png";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import CartDropdown from "./CartDropdown";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSellerDashboard = () => {
    navigate("/seller-login");
  };

  // Listen for addToCart events
  useEffect(() => {
    const handleAddToCart = (event) => {
      // Open the cart dropdown when a product is added
      setIsCartOpen(true);
    };

    window.addEventListener("addToCart", handleAddToCart);
    return () => {
      window.removeEventListener("addToCart", handleAddToCart);
    };
  }, []);

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white w-full shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-extrabold text-green-600 font-sans">
            G
          </span>
          <span className="text-2xl font-bold text-gray-800 font-sans">
            reenCart
          </span>
        </div>
        {/* Seller Dashboard */}
        <button
          onClick={handleSellerDashboard}
          className="hidden lg:block border border-gray-300 rounded-full px-4 py-1 text-gray-700 font-medium hover:bg-gray-100 mr-4"
        >
          Seller Dashboard
        </button>
        {/* Nav Links */}
        <ul className="flex items-center space-x-8 text-lg font-medium">
          <li>
            <Link to="/" className="hover:text-green-600">
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-green-600">
              All Products
            </Link>
          </li>
        </ul>
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mx-4 w-56">
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
          <button
            type="submit"
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </button>
        </form>
        {/* Cart Icon */}
        {isSignedIn ? (
          <div className="relative" ref={cartRef}>
            <img
              src={cart}
              alt="cart"
              className="w-7 h-7 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsCartOpen(!isCartOpen)}
            />
            <CartDropdown
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />
          </div>
        ) : (
          ""
        )}

        {/* Login Button */}
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 font-semibold text-lg transition">
              Login
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
}
