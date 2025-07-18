import React from "react";
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import "./BookCard.css";

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      // You could show a toast notification here or redirect to login
      alert('Please sign in to add items to your cart');
      return;
    }
    addToCart(book);
  };

  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} className="book-image" />
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">by {book.author}</p>
      <p className="book-price">${book.price}</p>
      <button 
        onClick={handleAddToCart}
        className="add-to-cart-btn"
        style={{
          backgroundColor: '#317ab5',
          color: '#000',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}
      >
        {isAuthenticated ? 'Add to Cart' : 'Sign in to Add'}
      </button>
    </div>
  );
};

export default BookCard;