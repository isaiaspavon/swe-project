import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../firebaseConfig';

const CreateAccountModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    payment: {
      cardType: '',
      cardNumber: '',
      expMonth: '',
      expYear: ''
    }
  });

  const [error, setError] = useState('');
  const [showVerifyNotice, setShowVerifyNotice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      fullName,
      phoneNumber,
      email,
      confirmEmail,
      password,
      confirmPassword,
      address,
      payment
    } = formData;

    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\d{10}$/;
    const zipRegex = /^\d{5}$/;
    const cityRegex = /^[A-Za-z\s]+$/;
    const cardNumberRegex = /^\d{15,16}$/;

    if (payment.cardNumber && !cardNumberRegex.test(payment.cardNumber.trim())) {
      setError('Card number must be 15 or 16 digits and contain only numbers');
      return;
    }
    if (!nameRegex.test(fullName.trim())) {
      setError('Name can only contain letters and spaces');
      return;
    }
    if (!phoneRegex.test(phoneNumber.trim())) {
      setError('Phone number must be exactly 10 digits');
      return;
    }
    if (address.zip && !zipRegex.test(address.zip.trim())) {
      setError('Zip code must be exactly 5 digits');
      return;
    }
    if (address.city && !cityRegex.test(address.city.trim())) {
      setError('City name can only contain letters');
      return;
    }
    if (!fullName || !phoneNumber || !email || !confirmEmail || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    if (email !== confirmEmail) {
      setError('Emails do not match');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await set(ref(db, 'users/' + user.uid), {
        name: fullName,
        phone: phoneNumber,
        email: email,
        status: "Inactive",
        createdAt: new Date().toISOString(),
        address: {
          street: address.street || '',
          city: address.city || '',
          state: address.state || '',
          zip: address.zip || ''
        },
        payment: {
          cardType: payment.cardType || '',
          cardNumber: payment.cardNumber || '',
          expDate: `${payment.expMonth || ''}/${payment.expYear || ''}`
        }
      });

      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        address: { street: '', city: '', state: '', zip: '' },
        payment: { cardType: '', cardNumber: '', expMonth: '', expYear: '' }
      });

      setError('');
      setShowVerifyNotice(true);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else {
        setError(err.message || 'Failed to create account');
      }
    }
  };

  if (!isOpen) return null;

  if (showVerifyNotice) {
    return (
      <div style={modalOverlay}>
        <div style={modalBox}>
          <h2 style={{ color: '#2e7d32' }}>Verification Email Sent!</h2>
          <p style={{ color: 'black', marginTop: '1rem' }}>
            Please check your email and click the verification link to activate your account.
          </p>
          <button
            onClick={() => {
              setShowVerifyNotice(false);
              onClose();
            }}
            style={submitButtonStyle}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={modalOverlay}>
      <div style={formBox}>
        <button
          onClick={onClose}
          style={closeButton}
          onMouseOver={e => e.currentTarget.style.background = '#e0e0e0'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          aria-label="Close"
        >
          &times;
        </button>

        <h2 style={{ textAlign: 'center', color: 'black', fontSize: '1.5rem', marginBottom: '1rem' }}>
          Create Account
        </h2>

        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={labelStyle}>Full Name: <span style={{ color: 'red' }}>*</span></label>
          <input type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} style={inputStyle} required />

          <label style={labelStyle}>Phone Number: <span style={{ color: 'red' }}>*</span></label>
          <input type="tel" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} style={inputStyle} required />

          <label style={labelStyle}>Email: <span style={{ color: 'red' }}>*</span></label>
          <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={inputStyle} required />

          <label style={labelStyle}>Confirm Email: <span style={{ color: 'red' }}>*</span></label>
          <input type="email" value={formData.confirmEmail} onChange={e => setFormData({ ...formData, confirmEmail: e.target.value })} style={inputStyle} required />

          <label style={labelStyle}>Password: <span style={{ color: 'red' }}>*</span></label>
          <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} style={inputStyle} required />

          <label style={labelStyle}>Confirm Password: <span style={{ color: 'red' }}>*</span></label>
          <input type="password" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} style={inputStyle} required />

          <h4 style={{ marginTop: '1rem', fontSize: '1rem', color: 'black' }}>Shipping Address (optional)</h4>
          <input type="text" placeholder="Street" value={formData.address.street} onChange={e => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} style={inputStyle} />
          <input type="text" placeholder="City" value={formData.address.city} onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} style={inputStyle} />
          <input type="text" placeholder="State" value={formData.address.state} onChange={e => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} style={inputStyle} />
          <input type="text" placeholder="Zip Code" value={formData.address.zip} onChange={e => setFormData({ ...formData, address: { ...formData.address, zip: e.target.value } })} style={inputStyle} />

          <h4 style={{ marginTop: '1rem', fontSize: '1rem', color: 'black' }}>Payment Info (optional)</h4>
          <label style={labelStyle}>Card Type:</label>
          <select value={formData.payment.cardType} onChange={e => setFormData({ ...formData, payment: { ...formData.payment, cardType: e.target.value } })} style={inputStyle}>
            <option value="">Select Card Type</option>
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="American Express">American Express</option>
            <option value="Discover">Discover</option>
          </select>

          <label style={labelStyle}>Card Number:</label>
          <input type="text" maxLength={16} value={formData.payment.cardNumber} onChange={e => setFormData({ ...formData, payment: { ...formData.payment, cardNumber: e.target.value } })} style={inputStyle} />

          <label style={labelStyle}>Expiration Date:</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select value={formData.payment.expMonth} onChange={e => setFormData({ ...formData, payment: { ...formData.payment, expMonth: e.target.value } })} style={{ ...inputStyle, flex: 1 }}>
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, '0');
                return <option key={month} value={month}>{month}</option>;
              })}
            </select>
            <select value={formData.payment.expYear} onChange={e => setFormData({ ...formData, payment: { ...formData.payment, expYear: e.target.value } })} style={{ ...inputStyle, flex: 1 }}>
              <option value="">Year</option>
              {Array.from({ length: 15 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return <option key={year} value={year}>{year}</option>;
              })}
            </select>
          </div>

          <button type="submit" style={submitButtonStyle}>Create Account</button>
          <div style={{ textAlign: 'center', color: 'black' }}>
            Already have an account? <span style={{ color: '#2e7d32', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => { onClose(); onSwitchToSignIn(); }}>Sign in</span>
          </div>
        </form>
      </div>
    </div>
  );
};

// 🎨 Styles
const inputStyle = {
  color: 'black',
  backgroundColor: '#FBFBFB',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc'
};
const labelStyle = {
  color: 'black',
  fontWeight: 'bold'
};
const modalOverlay = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10000,
  overflowY: 'auto',
  padding: '2rem'
};
const formBox = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
  position: 'relative'
};
const modalBox = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  width: '400px',
  textAlign: 'center',
  boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
};
const closeButton = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  width: '2rem',
  height: '2rem',
  background: 'transparent',
  border: 'none',
  borderRadius: '50%',
  fontSize: '1.25rem',
  color: '#666',
  cursor: 'pointer'
};
const submitButtonStyle = {
  padding: '0.5rem',
  backgroundColor: '#2e7d32',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '1rem'
};

export default CreateAccountModal;
