import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar.jsx";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import { CartProvider } from "./contexts/CartContext";
// import AdminDashboard from "./pages/AdminDashboard";
// import CheckoutPage from "./pages/CheckoutPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

function App() {
  return (
    <CartProvider>
      <div className="App">
        <Navbar />
        <div style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<ShoppingCartPage />} />
            {/* <Route path="/admin" element={<AdminDashboard />} /> */}
            {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
            {<Route path="/orders" element={<OrderHistoryPage />} />}
          </Routes>
        </div>
      </div>
    </CartProvider>
  );
}

export default App;