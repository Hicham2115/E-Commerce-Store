import "./App.css";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Categories from "./Components/Categories";
import BestSellers from "./Components/BestSellers";
import Newsletter from "./Components/Newsletter";
import Footer from "./Components/Footer";
import { Routes, Route } from "react-router-dom";
import AllProducts from "./Components/AllProducts";
import SellerLogin from "./Components/SellerLogin";
import Checkout from "./Components/Checkout";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import ProductDetails from "./Components/ProductDetails";
import OrderConfirmation from "./Components/OrderConfirmation";
import SellerDashboard from "./Components/SellerDashboard";

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <BestSellers />
      <Newsletter />
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <OrderProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<AllProducts />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/seller-login" element={<SellerLogin />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route path="/dashboard" element={<SellerDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </OrderProvider>
    </CartProvider>
  );
}

export default App;
