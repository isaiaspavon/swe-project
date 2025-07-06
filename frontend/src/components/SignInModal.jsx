// This will be the popup that appears when you hover over the "My Account" button then
// click on the "Sign In" button.

import React from 'react';

const SignInModal = ({ isOpen, onClose, onSwitchToCreateAccount }) => {
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
                    <input type="email" placeholder="Email" style={{ padding: '0.5rem' }} />
                    <input type="password" placeholder="Password" style={{ padding: '0.5rem' }} />
                    <button
                        type="submit"
                        style={{
                            padding: '0.5rem',
                            backgroundColor: '#2e7d32',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
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