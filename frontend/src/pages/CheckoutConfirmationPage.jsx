// pages/CheckoutConfirmationPage.jsx
import React, { useState } from 'react';
import "./CheckoutConfirmationPage.css";

const CheckoutConfirmationPage = () => {

  const [books] = useState([
    { title: 'The Great Gatsby', author:'F. Scott Fitzgerald' , quantity: 1, price: 13.99 },
    { title: 'The Way Of Kings', author:'Brandon Sanderson' , quantity: 2, price: 20.99 },
    { title: 'Hunger Games', author:'Suzanne Collins' , quantity: 3, price: 19.20 },
  ]);



  const calculateTotalBeforeTax = () => {
    return books.reduce((total, book) => total + book.quantity * book.price, 0).toFixed(2);
  };

  const [promotion, setPromotion] = useState(15);

  const handleApplyPromoCode = () => {
    alert(`Promo code applied: ${formData.promoCode}`);
    // Add promo code logic here (e.g., discount calculation)
  };

  return (
    <div className="checkout-page">
  

      <div className="checkout-right">
        {/* Order Summary */}
        <section className="order-summary">
          <h3 className= "order-summary-header">Order Summary</h3>
          <ul className='order-list-summary'>
            {books.map((book, index) => (
              <li key={index} className="book-item">
                <p className="book-title">{book.title} by {book.author}</p>
                <p className="book-quantity">({book.quantity})</p>
                <p className="book-price">${(book.quantity * book.price).toFixed(2)}</p>
              </li>
            ))}
          </ul>

        <div className="total">
        <p className="split-paragraph">
          <span className="left-side">Subtotal:</span>
          <span className="right-side">${calculateTotalBeforeTax()}</span>
        </p>

        <p className="split-paragraph">
          <span className="left-side">Tax (8.5%):</span>
          <span className="right-side">${(calculateTotalBeforeTax() * 0.085).toFixed(2)}</span>
        </p>

        {/* Conditionally render promotion (if available) */}
        {promotion && (
          <p className="split-paragraph">
            <span className="left-side">Promotion:</span>
            <span className="right-side">-${promotion.toFixed(2)}</span>
          </p>
        )}

        <p className="split-paragraph" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          <span className="left-side">Total:</span>
          <span className="right-side">
            ${(calculateTotalBeforeTax() * 1.085 - (promotion || 0)).toFixed(2)}
          </span>
        </p>
      </div>
          <button type="button" className="place-order">
            Place Order
          </button>
        </section>
      </div>
    </div>
  );
};

export default CheckoutConfirmationPage;