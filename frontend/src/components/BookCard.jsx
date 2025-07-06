// BookCard.jsx
// This file contains a reusable component to display book details in a card layout
import React from "react";
import { useCart } from '../contexts/CartContext';
import "./BookCard.css";

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(book);
  };

  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} className="book-image" />
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">by {book.author}</p>
      <p className="book-price">${book.price.toFixed(2)}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default BookCard;