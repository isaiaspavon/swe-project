import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar.jsx";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBooks from "./pages/AdminBooks";
import AdminUsers from "./pages/AdminUsers";
import AdminPromotions from "./pages/AdminPromotions";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AccountPage from "./pages/AccountPage.jsx";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutConfirmationPage from "./pages/CheckoutConfirmationPage";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
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
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout-confirmation" element={<CheckoutConfirmationPage />} />
              
              {/* Admin Routes - Protected */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/books" element={
                <AdminRoute>
                  <AdminBooks />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } />
              <Route path="/admin/promotions" element={
                <AdminRoute>
                  <AdminPromotions />
                </AdminRoute>
              } />
              
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Routes>
          </div>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;