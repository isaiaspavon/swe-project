import React from 'react';
import { useCart } from '../contexts/CartContext';
import ShoppingCartItem from '../components/ShoppingCartItem';
import './ShoppingCartPage.css';

const ShoppingCartPage = () => {
  const { items, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    // TODO: Navigate to checkout page
    console.log('Proceeding to checkout...');
  };

  if (items.length === 0) {
    return (
      <div className="shopping-cart-page">
        <h2 className="cart-title">Your Cart</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Your cart is empty</p>
          <button 
            onClick={() => window.history.back()}
            className="check-out-button"
            style={{ marginTop: '1rem' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart-page">
      <h2 className="cart-title">Cart Items:</h2>
      
      <div className="cart-checkout">
        <div className="cart-flex">
          {items.map((item) => (
            <ShoppingCartItem key={item.id} item={item} />
          ))}
        </div>
        
        <div className="order-summary-card">
          <h3>Order Summary</h3>
          <div style={{ marginBottom: '1rem' }}>
            <p>Subtotal: ${getCartTotal().toFixed(2)}</p>
            <p>Tax (8.5%): ${(getCartTotal() * 0.085).toFixed(2)}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              Total: ${(getCartTotal() * 1.085).toFixed(2)}
            </p>
          </div>
          <button 
            className="check-out-button"
            onClick={handleCheckout}
          >
            Check Out
          </button>
          <button 
            onClick={clearCart}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '0.75rem',
              width: '100%',
              border: 'none',
              borderRadius: '4px',
              textAlign: 'center',
              marginTop: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;