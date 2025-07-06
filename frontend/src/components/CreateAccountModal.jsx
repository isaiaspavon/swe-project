<<<<<<< HEAD
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const CreateAccountModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      onClose();
      setFormData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '' });
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

=======
// This will be the popup that appears when you hover over the "My Account" button then
// click on the "Create Account" button. 

import React from 'react';

const CreateAccountModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
>>>>>>> 817807e9986d32ea6ce025eb2bb3df2b1dfdb584
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          width: '400px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
<<<<<<< HEAD
            width: '2.5rem',
            height: '2.5rem',
=======
            width: '2rem',
            height: '2rem',
            padding: 0,
>>>>>>> 817807e9986d32ea6ce025eb2bb3df2b1dfdb584
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
<<<<<<< HEAD
            fontSize: '1rem',
=======
            fontSize: '1.25rem',
            lineHeight: 1,
>>>>>>> 817807e9986d32ea6ce025eb2bb3df2b1dfdb584
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
<<<<<<< HEAD
        
        <h2 style={{ textAlign: 'center', color: 'black', fontSize: '1.5rem', marginBottom: '1rem' }}>
          Create Account
        </h2>
        
        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
            {error}
          </p>
        )}
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="First Name" 
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required 
          />
          <input 
            type="text" 
            placeholder="Last Name" 
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required 
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required 
          />
=======
        <h2 style={{ textAlign: 'center', color: 'black', fontSize: '1.5rem', marginBottom: '1rem' }}>Create Account</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" placeholder="Full Name" style={{ backgroundColor: '#FBFBFB', padding: '0.5rem' }} />
          <input type="tel" placeholder="Phone number" style={{ backgroundColor: '#FBFBFB', padding: '0.5rem' }} />
          <input type="email" placeholder="Email" style={{ backgroundColor: '#FBFBFB', padding: '0.5rem' }} />
          <input type="email" placeholder="Confirm Email" style={{ backgroundColor: '#FBFBFB', padding: '0.5rem' }} />
          <input type="password" placeholder="Password" style={{ backgroundColor: '#FBFBFB', padding: '0.5rem' }} />
          <input type="password" placeholder="Confirm Password" style={{ backgroundColor: '#FBFBFB', padding: '0.5rem' }} />
>>>>>>> 817807e9986d32ea6ce025eb2bb3df2b1dfdb584
          <button
            type="submit"
            style={{
              padding: '0.5rem',
              backgroundColor: '#2e7d32',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
<<<<<<< HEAD
              cursor: 'pointer',
              fontSize: '1rem'
=======
              fontSize: '1rem',
>>>>>>> 817807e9986d32ea6ce025eb2bb3df2b1dfdb584
            }}
          >
            Create Account
          </button>
<<<<<<< HEAD
=======
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
>>>>>>> 817807e9986d32ea6ce025eb2bb3df2b1dfdb584
        </form>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default CreateAccountModal;
=======
export default CreateAccountModal; 
>>>>>>> 817807e9986d32ea6ce025eb2bb3df2b1dfdb584
