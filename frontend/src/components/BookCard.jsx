// BookCard.jsx
// This file contains a reusable component to display book details in a card layout
import React from "react";
import "./BookCard.css";

const BookCard = ({ book, onAddToCart }) => {
  return (
    <div className="book-card">
      <img src={book.image} alt={book.title} className="book-image" />
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">by {book.author}</p>
      <p className="book-price">${book.price.toFixed(2)}</p>
      <button onClick={() => onAddToCart(book)}>Add to Cart</button>    {/* This prop doesn't have functionality yet*/}
    </div>
  );
};

export default BookCard;
