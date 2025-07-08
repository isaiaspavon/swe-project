import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar.jsx";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import { CartProvider } from "./contexts/CartContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBooks from "./pages/AdminBooks";
import AdminUsers from "./pages/AdminUsers";
import AdminPromotions from "./pages/AdminPromotions";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AccountPage from "./pages/AccountPage.jsx";
import CheckoutConfirmationPage from "./pages/CheckoutConfirmationPage";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');

  return (
    <CartProvider>
      <div className="App">
        // This is to make the searchbar work
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
        <div style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={
              <HomePage
                searchQuery={searchQuery}
                searchFilter={searchFilter}
              />
            } />
            <Route path="/cart" element={<ShoppingCartPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/promotions" element={<AdminPromotions />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/checkout-confirmation" element={<CheckoutConfirmationPage />} />
          </Routes>
        </div>
      </div>
    </CartProvider>
  );
}

export default App;