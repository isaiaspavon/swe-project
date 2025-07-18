import React from 'react';
import { useCart } from '../contexts/CartContext';

const ShoppingCartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div style={{
      display: 'flex',
      border: '1px solid #333',
      borderRadius: '16px',
      padding: '1rem',
      marginBottom: '1rem',
      background: 'linear-gradient(to bottom right, #1e1e1e, #2a2a2a)',
      color: '#f4f4f5',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
    }}>
      <img 
        src={item.image} 
        alt={item.title}
        style={{
          width: '80px',
          height: '120px',
          objectFit: 'cover',
          marginRight: '1rem',
          borderRadius: '12px',
          background: '#2f2f2f'
        }}
      />
      
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#f4f4f5' }}>
          {item.title}
        </h3>
        <p style={{ margin: '0 0 0.5rem 0', color: '#bbb' }}>
          by {item.author}
        </p>
        <p style={{ margin: '0 0 1rem 0', fontWeight: 'bold', color: '#f3bc16ff' }}>
          ${item.price.toFixed(2)}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                lineHeight: 1,
                border: '1px solid #333',
                backgroundColor: '#2a2a2a',
                color: '#f4f4f5',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              -
            </button>
            <span style={{ minWidth: '30px', textAlign: 'center', color: '#f4f4f5' }}>
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              style={{
                width: '30px',
                height: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 0,
                lineHeight: 1,
                border: '1px solid #333',
                backgroundColor: '#2a2a2a',
                color: '#f4f4f5',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              +
            </button>
          </div>
          
          <button
            onClick={() => removeFromCart(item.id)}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}
          >
            Remove
          </button>
        </div>
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#f3bc16ff' }}>
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ShoppingCartItem;