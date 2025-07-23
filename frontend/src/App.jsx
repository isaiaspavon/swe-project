import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutConfirmationPage from "./pages/CheckoutConfirmationPage";
import AccountPage from "./pages/AccountPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBooks from "./pages/AdminBooks";
import AdminUsers from "./pages/AdminUsers";
import AdminPromotions from "./pages/AdminPromotions";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import AdminRoute from "./components/AdminRoute";
import SearchResultsPage from "./pages/SearchResultsPage";
import Aurora from "./components/Aurora";
import AboutPage from "./pages/AboutPage";
import WIPPage from "./pages/WIPPage";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');

  return (
    <>
      <Aurora
        colorStops={["#317ab5", "#bbacec", "#246dff"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <div style={{ paddingTop: '50px' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/cart" element={<ShoppingCartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout-confirmation" element={<CheckoutConfirmationPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/wip" element={<WIPPage />} />
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
              </Routes>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;