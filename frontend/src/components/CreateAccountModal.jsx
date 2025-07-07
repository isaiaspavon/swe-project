import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const CreateAccountModal = ({ isOpen, onClose, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.email !== formData.confirmEmail) {
      setError('Emails do not match');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      onClose();
      setFormData({ fullName: '', phoneNumber: '', email: '', confirmEmail: '', password: '', confirmPassword: '' });
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

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
        
        <h2 style={{ textAlign: 'center', color: 'black', fontSize: '1.5rem', marginBottom: '1rem' }}>
          Create Account
        </h2>
        
        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </p>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '-0.5rem' }}>
            Full Name: <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="text" 
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            style={{ color: 'black', backgroundColor: '#FBFBFB', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '-0.5rem' }}>
            Phone number: <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="tel" 
            placeholder="Phone number"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            style={{ color: 'black', backgroundColor: '#FBFBFB', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '-0.5rem' }}>
            Email: <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="email" 
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{ color: 'black', backgroundColor: '#FBFBFB', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '-0.5rem' }}>
            Confirm Email: <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="email" 
            placeholder="Confirm Email"
            value={formData.confirmEmail}
            onChange={(e) => setFormData({...formData, confirmEmail: e.target.value})}
            style={{ color: 'black', backgroundColor: '#FBFBFB', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '-0.5rem' }}>
            Password: <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="password" 
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ color: 'black', backgroundColor: '#FBFBFB', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '-0.5rem' }}>
            Confirm Password: <span style={{ color: 'red' }}>*</span>
          </label>
          <input 
            type="password" 
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            style={{ color: 'black', backgroundColor: '#FBFBFB', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button
            type="submit"
            style={{
              padding: '0.5rem',
              backgroundColor: '#2e7d32',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
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

export default CreateAccountModal;