import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
      expDate: ''
    }
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

    if (formData.payment.cardNumber && !cardNumberRegex.test(formData.payment.cardNumber.trim())) {
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
    if (formData.address.zip && !zipRegex.test(formData.address.zip.trim())) {
      setError('Zip code must be exactly 5 digits');
      return;
    }
    if (formData.address.city && !cityRegex.test(formData.address.city.trim())) {
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
          expDate: payment.expDate || ''
        }
      });

      setSuccess(true);
      setError('');
      setFormData({
        fullName: '',
        phoneNumber: '',
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        address: { street: '', city: '', state: '', zip: '' },
        payment: { cardType: '', cardNumber: '', expDate: '' }
      });

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3500);
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

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10000,
      overflowY: 'auto',
      padding: '2rem',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '2rem',
            height: '2rem',
            padding: 0,
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            lineHeight: 1,
            color: '#666',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#e0e0e0'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          aria-label="Close"
        >
          &times;
        </button>

        {success && (
          <div style={{
            background: '#2e7d32',
            color: 'white',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.05rem',
            boxShadow: '0 2px 8px rgba(46,125,50,0.08)'
          }}>
            Account created successfully!
          </div>
        )}

        <h2 style={{ textAlign: 'center', color: 'black', fontSize: '1.5rem', marginBottom: '1rem' }}>
          Create Account
        </h2>

        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Full Name */}
          <label style={{ color: 'black', fontWeight: 'bold' }}>Full Name: <span style={{ color: 'red' }}>*</span></label>
          <input type="text" placeholder="Full Name" value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            style={inputStyle} required />

          {/* Phone */}
          <label style={{ color: 'black', fontWeight: 'bold' }}>Phone Number: <span style={{ color: 'red' }}>*</span></label>
          <input type="tel" placeholder="Phone number" value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            style={inputStyle} required />

          {/* Email */}
          <label style={{ color: 'black', fontWeight: 'bold' }}>Email: <span style={{ color: 'red' }}>*</span></label>
          <input type="email" placeholder="Email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={inputStyle} required />

          {/* Confirm Email */}
          <label style={{ color: 'black', fontWeight: 'bold' }}>Confirm Email: <span style={{ color: 'red' }}>*</span></label>
          <input type="email" placeholder="Confirm Email" value={formData.confirmEmail}
            onChange={(e) => setFormData({ ...formData, confirmEmail: e.target.value })}
            style={inputStyle} required />

          {/* Password */}
          <label style={{ color: 'black', fontWeight: 'bold' }}>Password: <span style={{ color: 'red' }}>*</span></label>
          <input type="password" placeholder="Password" value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={inputStyle} required />

          {/* Confirm Password */}
          <label style={{ color: 'black', fontWeight: 'bold' }}>Confirm Password: <span style={{ color: 'red' }}>*</span></label>
          <input type="password" placeholder="Confirm Password" value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            style={inputStyle} required />

          {/* Shipping Address */}
          <h4 style={{ marginTop: '1rem', fontSize: '1rem', color: 'black' }}>Shipping Address (optional)</h4>
          <input type="text" placeholder="Street" value={formData.address.street}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
            style={inputStyle} />
          <input type="text" placeholder="City" value={formData.address.city}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
            style={inputStyle} />
          <input type="text" placeholder="State" value={formData.address.state}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
            style={inputStyle} />
          <input type="text" placeholder="Zip Code" value={formData.address.zip}
            onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zip: e.target.value } })}
            style={inputStyle} />

          {/* Payment Info */}
          <h4 style={{ marginTop: '1rem', fontSize: '1rem', color: 'black' }}>Payment Info (optional)</h4>
          <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '-0.5rem' }}>
            Card Type:
          </label>
          <select
            value={formData.payment.cardType}
            onChange={(e) =>
              setFormData({
                ...formData,
                payment: { ...formData.payment, cardType: e.target.value }
              })
            }
            style={inputStyle}
          >
            <option value="">Select Card Type</option>
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="American Express">American Express</option>
            <option value="Discover">Discover</option>
          </select>
          <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '-0.5rem' }}>
            Card Number: </label>
          <input type="text" placeholder="Card Number" maxLength={16} value={formData.payment.cardNumber}
            onChange={(e) => setFormData({ ...formData, payment: { ...formData.payment, cardNumber: e.target.value } })}
            style={inputStyle} />

            <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '-0.5rem' }}>
              Expiration Date:
            </label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select
                value={formData.payment.expMonth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment: { ...formData.payment, expMonth: e.target.value }
                  })
                }
                style={{ ...inputStyle, flex: 1 }}
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = String(i + 1).padStart(2, '0');
                  return <option key={month} value={month}>{month}</option>;
                })}
              </select>

              <select
                value={formData.payment.expYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment: { ...formData.payment, expYear: e.target.value }
                  })
                }
                style={{ ...inputStyle, flex: 1 }}
              >
                <option value="">Year</option>
                {Array.from({ length: 15 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>

          

          <button type="submit" style={{
            padding: '0.5rem',
            backgroundColor: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Create Account
          </button>

          <div style={{ color: 'black', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <span
              style={{ color: '#2e7d32', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => {
                onClose();
                onSwitchToSignIn();
              }}
            >
              Sign in
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle = {
  color: 'black',
  backgroundColor: '#FBFBFB',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

export default CreateAccountModal;
