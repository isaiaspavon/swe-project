import React from "react";
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import "./BookCard.css";

const BookCard = ({ book }) => {
  const { addOrUpdateCartBook, getCartBooks } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please sign in to add items to your cart');
      return;
    }
    const cartBooks = getCartBooks() || [];
    const existing = cartBooks.find(item => item.bookId === book.id);
    const newQuantity = existing ? existing.quantity + 1 : 1;
    addOrUpdateCartBook(book.id, newQuantity);
  };

  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} className="book-image" />
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">by {book.author}</p>
      <p className="book-price">${(book.price || 0).toFixed(2)}</p>
      <button 
        onClick={handleAddToCart}
        className="add-to-cart-btn"
        style={{
          background: 'linear-gradient(#a8d6f5ff, #82c7f5ff)',
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