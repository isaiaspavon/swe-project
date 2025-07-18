import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ShoppingCartItem from '../components/ShoppingCartItem';
import './ShoppingCartPage.css';
import { useNavigate } from 'react-router-dom';

const ShoppingCartPage = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert('Please sign in to complete your purchase');
      return;
    }
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="shopping-cart-page">
        <h2 className="cart-title">Your Cart</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Your cart is empty</p>
          <button 
            onClick={handleContinueShopping}
            style={{
              backgroundColor: '#317ab5',
              color: '#000',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const tax = subtotal * 0.085;
  const total = subtotal + tax;

  return (
    <div className="shopping-cart-page">
      <h2 className="cart-title">Your Cart</h2>
      <div className="cart-content">
        <div className="cart-items">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '1rem',
            padding: '0 1rem'
          }}>
            <h3 style={{ margin: 0 }}>Items ({items.length})</h3>
            <button 
              onClick={handleClearCart}
              style={{
                backgroundColor: 'transparent',
                color: '#ef4444',
                border: '1px solid #ef4444',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Clear Cart
            </button>
          </div>
          {items.map((item) => (
            <ShoppingCartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-item">
            <span>Subtotal ({items.length} items):</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Tax (8.5%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <button 
              onClick={handleCheckout}
              className="checkout-button"
              style={{
                backgroundColor: isAuthenticated ? '#81bbeaff' : '#ccc',
                color: isAuthenticated ? '#000' : '#666',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                fontSize: '1rem',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
            </button>
            
            <button 
              onClick={handleContinueShopping}
              style={{
                backgroundColor: 'transparent',
                color: '#317ab5',
                border: '1px solid #317ab5',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;