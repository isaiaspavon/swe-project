import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ref, push, get, onValue } from 'firebase/database';
import { db, fetchBooks } from '../firebaseConfig';
import "./CheckoutPage.css";
import { decryptData } from '../utils/encryption';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { getCartBooks, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [availablePromos, setAvailablePromos] = useState([]);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Fetch all books for price/title lookup
  useEffect(() => {
    fetchBooks(setBooks);
  }, []);

  // Join cartBooks with book data
  const cartBooks = getCartBooks() || [];
  const items = cartBooks.map(item => {
    const book = books.find(b => b.id === item.bookId) || {};
    return { ...item, ...book };
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    promoCode: '',
  });

  // Fetch available promotions
  useEffect(() => {
    const promosRef = ref(db, 'promotions');
    const unsubscribe = onValue(promosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const currentDate = new Date();
        const promosArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).filter(promo => {
          const startDate = new Date(promo.startDate);
          const endDate = new Date(promo.endDate);
          return promo.isActive &&
            currentDate >= startDate &&
            currentDate <= endDate;
        });
        setAvailablePromos(promosArray);
      } else {
        setAvailablePromos([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (!currentUser) return;
    const userRef = ref(db, `users/${currentUser.uid}`);
    get(userRef).then(snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setFormData(prev => ({
          ...prev,
          firstName: userData.name ? userData.name.split(' ')[0] : '',
          lastName: userData.name ? userData.name.split(' ').slice(1).join(' ') : '',
          email: userData.email || '',
          addressLine1: userData.address?.addressLine1 || userData.address?.street || '',
          addressLine2: userData.address?.street2 || '',
          city: userData.address?.city || '',
          state: userData.address?.state || '',
          zipCode: userData.address?.zip || '',
        }));
      }
    });
  }, [currentUser]);

  // Fetch payment card info
  useEffect(() => {
    if (!currentUser) return;
    const paymentCardsRef = ref(db, `paymentCards/${currentUser.uid}`);
    const registrationCardRef = ref(db, `users/${currentUser.uid}/payment`);

    get(paymentCardsRef).then(paymentSnap => {
      const paymentData = paymentSnap.val() || {};
      // Find default card
      let defaultCard = null;
      for (const key in paymentData) {
        if (paymentData[key].default) {
          defaultCard = paymentData[key];
          break;
        }
      }
      // If no default, pick the first card
      if (!defaultCard && Object.keys(paymentData).length > 0) {
        defaultCard = paymentData[Object.keys(paymentData)[0]];
      }
      if (defaultCard) {
        let cardNumber = '';
        let expDate = '';
        let cvv = '';
        try {
          cardNumber = defaultCard.cardNumber ? decryptData(defaultCard.cardNumber) : '';
        } catch (err) {
          cardNumber = defaultCard.cardNumber || '';
        }
        try {
          expDate = defaultCard.expDate ? decryptData(defaultCard.expDate) : '';
        } catch (err) {
          expDate = defaultCard.expDate || '';
        }
        // If CVV is stored, decrypt
        try {
          cvv = defaultCard.cvv ? decryptData(defaultCard.cvv) : '';
        } catch (err) {
          cvv = defaultCard.cvv || '';
        }
        setFormData(prev => ({
          ...prev,
          cardNumber: cardNumber,
          expiryDate: expDate,
          cvv: cvv,
        }));
        return;
      }
      // Fallback
      get(registrationCardRef).then(regSnap => {
        const regData = regSnap.val() || {};
        if (regData.cardNumber && regData.expDate) {
          let cardNumber = '';
          let expDate = '';
          let cvv = '';
          try {
            cardNumber = decryptData(regData.cardNumber);
          } catch (err) {
            cardNumber = regData.cardNumber || '';
          }
          try {
            expDate = decryptData(regData.expDate);
          } catch (err) {
            expDate = regData.expDate || '';
          }
          try {
            cvv = regData.cvv ? decryptData(regData.cvv) : '';
          } catch (err) {
            cvv = regData.cvv || '';
          }
          setFormData(prev => ({
            ...prev,
            cardNumber: cardNumber,
            expiryDate: expDate,
            cvv: cvv,
          }));
        }
      });
    });
  }, [currentUser]);

  // Handlers for shipping/payment/promo code
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

  // Validation functions
  const validateShippingAddress = (formData) => {
    const errors = [];
    if (!formData.firstName || formData.firstName.trim() === '') errors.push("First name is required");
    if (!formData.lastName || formData.lastName.trim() === '') errors.push("Last name is required");
    if (!formData.email || formData.email.trim() === '') errors.push("Email is required");
    if (!formData.addressLine1 || formData.addressLine1.trim() === '') errors.push("Address Line 1 is required");
    if (!formData.city || formData.city.trim() === '') errors.push("City is required");
    if (!formData.zipCode || formData.zipCode.trim() === '') errors.push("Zip code is required");
    return { isValid: errors.length === 0, errors };
  };

  const validatePaymentMethod = (formData) => {
    const errors = [];
    if (!formData.cardNumber || formData.cardNumber.trim() === '') errors.push("Card number is required");
    if (!formData.expiryDate || formData.expiryDate.trim() === '') errors.push("Expiry date is required");
    if (!formData.cvv || formData.cvv.trim() === '') errors.push("CVV is required");
    return { isValid: errors.length === 0, errors };
  };

  // Promo code logic
  const handleApplyPromoCode = () => {
    const promoCode = formData.promoCode.toUpperCase().trim();
    if (!promoCode) {
      alert('Please enter a promo code');
      return;
    }
    const matchingPromo = availablePromos.find(promo =>
      promo.code === promoCode && promo.isActive
    );
    if (!matchingPromo) {
      alert('Invalid or expired promo code');
      setAppliedPromo(null);
      setPromoDiscount(0);
      return;
    }
    const currentDate = new Date();
    const startDate = new Date(matchingPromo.startDate);
    const endDate = new Date(matchingPromo.endDate);
    if (currentDate < startDate) {
      alert('This promo code is not yet valid');
      setAppliedPromo(null);
      setPromoDiscount(0);
      return;
    }
    if (currentDate > endDate) {
      alert('This promo code has expired');
      setAppliedPromo(null);
      setPromoDiscount(0);
      return;
    }
    const subtotal = calculateSubtotal();
    if (matchingPromo.minOrderAmount > 0 && subtotal < matchingPromo.minOrderAmount) {
      alert(`This promo code requires a minimum order of $${matchingPromo.minOrderAmount.toFixed(2)}`);
      setAppliedPromo(null);
      setPromoDiscount(0);
      return;
    }
    let discount = 0;
    if (matchingPromo.discountType === 'percentage') {
      discount = subtotal * (matchingPromo.discountValue / 100);
    }
    discount = Math.min(discount, subtotal);
    setAppliedPromo(matchingPromo);
    setPromoDiscount(discount);
    alert(`Promo code applied: ${matchingPromo.description}`);
  };

  const handleRemovePromoCode = () => {
    setFormData({ ...formData, promoCode: '' });
    setAppliedPromo(null);
    setPromoDiscount(0);
  };

  // Order calculations
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal() - promoDiscount;
    return (subtotal * 0.085);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal() - promoDiscount;
    const tax = subtotal * 0.085;
    return (subtotal + tax);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please sign in to complete your order.');
      return;
    }
    const shippingValidation = validateShippingAddress(formData);
    if (!shippingValidation.isValid) {
      alert(`Shipping Address Issues:\n${shippingValidation.errors.join('\n')}`);
      return;
    }
    const paymentValidation = validatePaymentMethod(formData);
    if (!paymentValidation.isValid) {
      alert(`Payment Method Issues:\n${paymentValidation.errors.join('\n')}`);
      return;
    }
    const order = {
      items: items,
      subtotal: calculateSubtotal(),
      promoCode: appliedPromo ? appliedPromo.code : null,
      promoDiscount: promoDiscount,
      tax: parseFloat(calculateTax()),
      total: parseFloat(calculateTotal()),
      shipping: formData,
      orderDate: new Date().toISOString(),
      orderNumber: 'ORD-' + Date.now(),
      status: 'Placed',
      userId: currentUser.uid,
      userEmail: currentUser.email
    };
    try {
      const ordersRef = ref(db, `orders/${currentUser.uid}`);
      const newOrderRef = await push(ordersRef, order);
      const orderWithId = { ...order, id: newOrderRef.key };
      clearCart();
      navigate('/checkout-confirmation', { state: orderWithId });
    } catch (error) {
      console.error('Error saving order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };

  if (!currentUser) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Please Sign In</h2>
        <p>You need to be signed in to complete your order.</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p>Please add some items to your cart before checkout.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        {/* Shipping Address */}
        <section className="shipping-address">
          <h3 className="shipping-header">Confirm Shipping Address</h3>
          <form>
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleShippingChange} required style={{ color: '#000' }} />
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleShippingChange} required style={{ color: '#000' }} />
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleShippingChange} required style={{ color: '#000' }} />
            <label>Address Line 1</label>
            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleShippingChange} required style={{ color: '#000' }} />
            <label>Address Line 2 (Optional)</label>
            <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleShippingChange} style={{ color: '#000' }} />
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleShippingChange} required style={{ color: '#000' }} />
            <label>State</label>
            <input type="text" name="state" value={formData.state} onChange={handleShippingChange} required style={{ color: '#000' }} />
            <label>Zip Code</label>
            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleShippingChange} required style={{ color: '#000' }} />
          </form>
        </section>

        {/* Payment Information */}
        <section className="payment-info">
          <h3 className="payment-header">Confirm Payment Information</h3>
          <form>
            <label>Card Number</label>
            <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handlePaymentChange} required style={{ color: '#000' }} />
            <label>Expiration Date</label>
            <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handlePaymentChange} required style={{ color: '#000' }} />
            <label>CVV</label>
            <input type="text" name="cvv" value={formData.cvv} onChange={handlePaymentChange} required style={{ color: '#000' }} />
          </form>
        </section>

        {/* Promo Code */}
        <section className="promo-code">
          <h3 className="promo-header">Enter Promo Code</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
            <input
              type="text"
              value={formData.promoCode}
              onChange={handlePromoCodeChange}
              placeholder="Enter Promo Code"
              style={{ color: '#000', flex: 1 }}
              disabled={appliedPromo !== null}
            />
            {appliedPromo ? (
              <button type="button" className="place-order primary-btn" onClick={handleRemovePromoCode} style={{ background: '#f87171' }}>
                Remove
              </button>
            ) : (
              <button type="button" className="place-order primary-btn" onClick={handleApplyPromoCode}>
                Apply
              </button>
            )}
          </div>
          {appliedPromo && (
            <p style={{ color: '#4ade80', fontSize: '0.9em', margin: 0 }}>
              ✓ {appliedPromo.description}
            </p>
          )}
        </section>
      </div>

      <div className="checkout-right">
        {/* Order Summary */}
        <section className="order-summary">
          <h3 className="order-summary-header">Order Summary</h3>
          <ul className='order-list-summary'>
            {items.map((item, index) => (
              <li key={index} className="book-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ flex: 1, fontWeight: 500 }}>{item.title} <span style={{ color: '#FFFFFF', fontSize: '0.98em' }}>({item.quantity})</span></span>
                <span style={{ minWidth: 60, textAlign: 'right', fontWeight: 'bold' }}>${((item.price || 0) * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="total">
            <p className="split-paragraph">
              <span className="left-side">Subtotal:</span>
              <span className="right-side">${calculateSubtotal().toFixed(2)}</span>
            </p>
            {appliedPromo && promoDiscount > 0 && (
              <p className="split-paragraph" style={{ color: '#4ade80' }}>
                <span className="left-side">
                  Discount ({appliedPromo.code}):
                  <button 
                    onClick={handleRemovePromoCode}
                    style={{ 
                      marginLeft: '8px', 
                      background: 'transparent', 
                      border: 'none', 
                      color: '#f87171', 
                      cursor: 'pointer',
                      fontSize: '0.8em'
                    }}
                  >
                    Remove
                  </button>
                </span>
                <span className="right-side">-${promoDiscount.toFixed(2)}</span>
              </p>
            )}
            <p className="split-paragraph">
              <span className="left-side">Tax (8.5%):</span>
              <span className="right-side">${calculateTax().toFixed(2)}</span>
            </p>
            <p className="split-paragraph" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span className="left-side">Total:</span>
              <span className="right-side">${calculateTotal().toFixed(2)}</span>
            </p>
          </div>
          <button type="button" className="place-order primary-btn" onClick={handleSubmit}>
            Place Order
          </button>
        </section>
      </div>
    </div>
  );
};

export default CheckoutPage;