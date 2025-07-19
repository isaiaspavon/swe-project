import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ref, push, get, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';
import "./CheckoutPage.css";
import { decryptData } from '../utils/encryption';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  
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

  useEffect(() => {
    if (!currentUser) return;

    // Fetch user profile (name, email, address, etc.)
    const userRef = ref(db, `users/${currentUser.uid}`);
    get(userRef).then(snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        setFormData(prev => ({
          ...prev,
          firstName: userData.address.name ? userData.address.name.split(' ')[0] : '',
          lastName: userData.address.name ? userData.address.name.split(' ').slice(1).join(' ') : '',
          email: userData.email || '',
          addressLine1: userData.address?.addressLine1 || userData.address?.street || '',
          addressLine2: userData.address?.street2 || '',
          city: userData.address?.city || '',
          state: userData.address?.state || '',
          zipCode: userData.address?.zip || '',
          // Optionally, add more fields if you store them
        }));
      }
    });

    // Fetch payment info (if you store it in a separate location)
    const paymentRef = ref(db, `users/${currentUser.uid}/payment`);
    get(paymentRef).then(snapshot => {
      if (snapshot.exists()) {
        const paymentData = snapshot.val();
        setFormData(prev => ({
          ...prev,
          cardNumber: paymentData.cardNumber || '',
          expiryDate: paymentData.expDate || '',
          // Add CVV if you store it (not recommended for security)
        }));
      }
    });

    // Fetch default payment card
    const paymentCardsRef = ref(db, `paymentCards/${currentUser.uid}`);
    onValue(paymentCardsRef, (snapshot) => {
      const cards = snapshot.val();
      if (cards) {
        const cardArr = Object.values(cards);
        const defaultCard = cardArr.find(card => card.default) || cardArr[0];
        if (defaultCard) {
          setFormData(prev => ({
            ...prev,
            cardNumber: defaultCard.cardNumber ? decryptData(defaultCard.cardNumber) : '',
            expiryDate: defaultCard.expDate ? decryptData(defaultCard.expDate) : '',
          }));
        }
      }
    }, { onlyOnce: true });
  }, [currentUser]);

  const handleShippingChange = (e) => {
    
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
  };

  const handleSaveShippingChanges = async () => {
    if (!currentUser) return;
    
    try {
      const userRef = ref(db, `users/${currentUser.uid}`);
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          zip: formData.zipCode,
          state: formData.state,
        }
      };
      
      await push(userRef, updateData);
      alert('Shipping address saved successfully!');
    } catch (error) {
      console.error('Error saving shipping address:', error);
      alert('Error saving shipping address. Please try again.');
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSavePaymentChanges = async () => {
    if (!currentUser) return;
    
    try {
      const paymentRef = ref(db, `users/${currentUser.uid}/payment`);
      const updateData = {
        cardNumber: formData.cardNumber,
        expDate: formData.expiryDate,
        // Don't save CVV for security reasons
      };
      
      await push(paymentRef, updateData);
      alert('Payment information saved successfully!');
    } catch (error) {
      console.error('Error saving payment information:', error);
      alert('Error saving payment information. Please try again.');
    }
  };  

  const handlePromoCodeChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, promoCode: value });
  };

  const validateShippingAddress = (formData) => {
        const errors = [];
        
        if (!formData.firstName || formData.firstName.trim() === '') {
          errors.push("First name is required");
        }
        
        if (!formData.lastName || formData.lastName.trim() === '') {
          errors.push("Last name is required");
        }
        
        if (!formData.email || formData.email.trim() === '') {
          errors.push("Email is required");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.push("Please enter a valid email address");
        }
        
        if (!formData.addressLine1 || formData.addressLine1.trim() === '') {
          errors.push("Address Line 1 is required");
        }
        
        if (!formData.city || formData.city.trim() === '') {
          errors.push("City is required");
        }
        
        if (!formData.zipCode || formData.zipCode.trim() === '') {
          errors.push("Zip code is required");
        }
        
        return {
          isValid: errors.length === 0,
          errors
        };
      };

      const validatePaymentMethod = (formData) => {
        const errors = [];
        
        if (!formData.cardNumber || formData.cardNumber.trim() === '') {
          errors.push("Card number is required");
        } else {
          // Remove spaces and check if it's all digits and proper length
          const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
          if (!/^\d{13,19}$/.test(cleanCardNumber)) {
            errors.push("Please enter a valid card number");
          }
        }
        
        if (!formData.expiryDate || formData.expiryDate.trim() === '') {
          errors.push("Expiry date is required");
        } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
          errors.push("Expiry date must be in MM/YY format");
        }
        
        if (!formData.cvv || formData.cvv.trim() === '') {
          errors.push("CVV is required");
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
          errors.push("CVV must be 3 or 4 digits");
        }
        
        return {
          isValid: errors.length === 0,
          errors
        };
      };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please sign in to complete your order.');
      return;
    }

    // Validate shipping address
    const shippingValidation = validateShippingAddress(formData);
    if (!shippingValidation.isValid) {
      alert(`Shipping Address Issues:\n${shippingValidation.errors.join('\n')}`);
      return;
    }

    // Validate payment method
    const paymentValidation = validatePaymentMethod(formData);
    if (!paymentValidation.isValid) {
      alert(`Payment Method Issues:\n${paymentValidation.errors.join('\n')}`);
      return;
    }
    const cleanShippingData = {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      email: formData.email || '',
      addressLine1: formData.addressLine1 || '',
      addressLine2: formData.addressLine2 || '',
      city: formData.city || '',
      state: formData.state || '',
      zipCode: formData.zipCode || '',
      cardNumber: formData.cardNumber || '',
      expiryDate: formData.expiryDate || '',
      // Don't include CVV in the order for security
    };

    // Create order object with all the data
    const order = {
      items: items,
      subtotal: getCartTotal(),
      tax: getCartTotal() * 0.085,
      total: getCartTotal() * 1.085,
      shipping: formData,
      orderDate: new Date().toISOString(),
      orderNumber: 'ORD-' + Date.now(),
      status: 'Placed',
      userId: currentUser.uid,
      userEmail: currentUser.email
    };

    try {
      // Save order to Firebase
      const ordersRef = ref(db, `orders/${currentUser.uid}`);
      const newOrderRef = await push(ordersRef, order);
      
      // Update order with Firebase-generated ID
      const orderWithId = {
        ...order,
        id: newOrderRef.key
      };

      // Clear the cart
      clearCart();
      
      // Navigate to confirmation page with order data
      navigate('/checkout-confirmation', { state: orderWithId });
    } catch (error) {
      console.error('Error saving order:', error);
      alert('There was an error processing your order. Please try again.');
    }
  };

  const calculateTotalBeforeTax = () => {
    return getCartTotal().toFixed(2);
  };

  const [promotion, setPromotion] = useState(0);

  const handleApplyPromoCode = () => {
    if (formData.promoCode.toLowerCase() === 'welcome15') {
      setPromotion(15);
      alert('Promo code applied: 15% off!');
    } else {
      alert('Invalid promo code');
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
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleShippingChange}
              required
              style={{ color: '#000' }}

            />
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleShippingChange}
              required
              style={{ color: '#000' }}

            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleShippingChange}
              required
              style={{ color: '#000' }}
            />
            <label>Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleShippingChange}
              required
              style={{ color: '#000' }}
            />
            <label>Address Line 2 (Optional)</label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleShippingChange}
              style={{ color: '#000' }}
            />
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleShippingChange}
              required
              style={{ color: '#000' }}
            />
            <label>State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleShippingChange}
              required
              style={{ color: '#000' }}
            />
            <label>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleShippingChange}
              required
              style={{ color: '#000' }}
            />
            {/* Shipping Address Save Changes */}
            <button type="button" className="place-order primary-btn" onClick={handleSaveShippingChanges}>
              Save Changes
            </button>
          </form>
        </section>

        {/* Payment Information */}
        <section className="payment-info">
          <h3 className="payment-header">Confirm Payment Information</h3>
          <form>
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handlePaymentChange}
              required
              style={{ color: '#000' }}
            />
            <label>Expiration Date</label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handlePaymentChange}
              required
              style={{ color: '#000' }}
            />
            <label>CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handlePaymentChange}
              required
              style={{ color: '#000' }}
            />
            {/* Payment Info Save Changes */}
            <button type="button" className="place-order primary-btn" onClick={handleSavePaymentChanges}>
              Save Changes
            </button>
          </form>
        </section>

        {/* Promo Code */}
        <section className="promo-code">
          <h3 className="promo-header">Enter Promo Code</h3>
          <input
            type="text"
            value={formData.promoCode}
            onChange={handlePromoCodeChange}
            placeholder="Enter Promo Code"
            style={{ color: '#000' }}
          />
          {/* Promo Code Apply */}
          <button type="button" className="place-order primary-btn" onClick={handleApplyPromoCode}>
            Apply
          </button>
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
                <span style={{ minWidth: 60, textAlign: 'right', fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</span>
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
            {promotion > 0 && (
              <p className="split-paragraph">
                <span className="left-side">Promotion:</span>
                <span className="right-side">-${promotion.toFixed(2)}</span>
              </p>
            )}

            <p className="split-paragraph" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              <span className="left-side">Total:</span>
              <span className="right-side">
                ${(calculateTotalBeforeTax() * 1.085 - promotion).toFixed(2)}
              </span>
            </p>
          </div>
          {/* Place Order */}
          <button type="button" className="place-order primary-btn" onClick={handleSubmit}>
            Place Order
          </button>
        </section>
      </div>
    </div>
  );
};

export default CheckoutPage;