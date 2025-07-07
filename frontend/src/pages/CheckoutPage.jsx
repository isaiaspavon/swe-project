// pages/CheckoutPage.jsx
import React, { useState } from 'react';
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    promoCode: '',
  });

   const [books] = useState([
    { title: 'The Great Gatsby', author:'F. Scott Fitzgerald' , quantity: 1, price: 13.99 },
    { title: 'The Way Of Kings', author:'Brandon Sanderson' , quantity: 2, price: 20.99 },
    { title: 'Hunger Games', author:'Suzanne Collins' , quantity: 3, price: 19.20 },
  ]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePromoCodeChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, promoCode: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle checkout logic
  };

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
      <div className="checkout-left">
        {/* Shipping Address */}
        <section className="shipping-address">
          <h3 className= "shipping-header">Confirm Shipping Address</h3>
          <form>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleShippingChange}
              required
            />
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleShippingChange}
              required
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleShippingChange}
              required
            />
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleShippingChange}
              required
            />
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleShippingChange}
              required
            />
            <label>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleShippingChange}
              required
            />
            <button type="button">Save Changes</button>
          </form>
        </section>

        {/* Payment Information */}
        <section className="payment-info">
          <h3 className= "payment-header">Confirm Payment Information</h3>
          <form>
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handlePaymentChange}
              required
            />
            <label>Expiration Date</label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handlePaymentChange}
              required
            />
            <label>CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handlePaymentChange}
              required
            />
            <button type="button">Save Changes</button>
          </form>
        </section>

        {/* Promo Code */}
        <section className="promo-code">
          <h3 className= "promo-header">Enter Promo Code</h3>
          <input
            type="text"
            value={formData.promoCode}
            onChange={handlePromoCodeChange}
            placeholder="Enter Promo Code"
          />
          <button type="button" onClick={handleApplyPromoCode}>
            Apply
          </button>
        </section>
      </div>

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

export default CheckoutPage;