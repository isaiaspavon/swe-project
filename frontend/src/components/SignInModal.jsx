// This will be the popup that appears when you hover over the "My Account" button then
// click on the "Sign In" button.

import React, { useState } from 'react';

const SignInModal = ({ isOpen, onClose, onSwitchToCreateAccount }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
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
                        width: '2.5rem',
                        height: '2.5rem',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
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

                <h2 style={{ textAlign: 'center', color: 'black', fontSize: '1.5rem', marginBottom: '1rem' }}>Sign In</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <label style={{ color: 'black', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          style={{ marginRight: '0.3rem' }}
                        />
                        Remember me
                      </label>
                      <span
                        style={{
                          color: '#2e7d32',
                          fontSize: '0.9rem',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          alignSelf: 'flex-end'
                        }}
                        onClick={() => {/* have to dd forgot password logic here later on*/}}
                      >
                        Forgot your password?
                      </span>
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: '0.5rem',
                            backgroundColor: '#2e7d32',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            width: '100%',
                            cursor: 'pointer',
                        }}
                    >
                        Sign In
                    </button>
                    <div style={{ color: 'black', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}> 
                        Don't have an account?{' '}
                        <span
                            style={{ color: '#2e7d32', cursor: 'pointer', textDecoration: 'underline' }}
                            onClick={() => {
                                onClose();
                                onSwitchToCreateAccount();
                            }}
                        >
                            Create account
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignInModal;