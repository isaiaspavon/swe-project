import React, { useState } from 'react';
import { loginUser } from '../firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const SignInModal = ({ isOpen, onClose, onSwitchToCreateAccount, onLogin }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        setIsLoading(true);
        setError('');

        try {
            const response = await loginUser(formData.email, formData.password);
            if (response.success) {
                console.log('Login successful!', response.user);
                setFormData({ email: '', password: '' });
                setRememberMe(false);
                onClose();

                if (onLogin) onLogin(response.userData || { uid: response.user.uid, email: response.user.email });
            } else {
                setError(response.error);
            }
        } catch (error) {
            console.error('❌ handleSubmit error:', error); 
            setError('An error occurred while logging in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setResetMessage('Please enter your email address.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetMessage('Password reset email sent! Please check your inbox.');
            setResetEmail('');
        } catch (error) {
            console.error('Password reset error:', error);
            if (error.code === 'auth/user-not-found') {
                setResetMessage('No account found with this email address.');
            } else {
                setResetMessage('An error occurred. Please try again.');
            }
        }
    };

    if (showForgotPassword) {
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
                        onClick={() => setShowForgotPassword(false)}
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

                    <h2 style={{ textAlign: 'center', color: 'black', fontSize: '1.5rem', marginBottom: '1rem' }}>Reset Password</h2>
                    
                    {resetMessage && (
                        <div style={{ 
                            color: resetMessage.includes('sent') ? 'green' : 'red', 
                            textAlign: 'center', 
                            marginBottom: '1rem',
                            padding: '0.5rem',
                            backgroundColor: resetMessage.includes('sent') ? '#e8f5e8' : '#ffebee',
                            borderRadius: '4px',
                            border: `1px solid ${resetMessage.includes('sent') ? '#4caf50' : '#f44336'}`
                        }}>
                            {resetMessage}
                        </div>
                    )}

                    <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ color: 'black', fontWeight: 'bold', marginBottom: '-0.5rem' }}>
                            Email: <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input 
                            type="email" 
                            placeholder="Enter your email address" 
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            style={{ color: 'black', backgroundColor: '#FBFBFB', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            required
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '0.5rem',
                                backgroundColor: '#317ab5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                width: '100%',
                                cursor: 'pointer',
                            }}
                        >
                            Send Reset Email
                        </button>
                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                            <span
                                style={{ color: '#3b57acff', cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => setShowForgotPassword(false)}
                            >
                                Back to Sign In
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

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
                
                
                {error && (
                    <div style={{ 
                        color: 'red', 
                        textAlign: 'center', 
                        marginBottom: '1rem',
                        padding: '0.5rem',
                        backgroundColor: '#ffebee',
                        borderRadius: '4px',
                        border: '1px solid #f44336'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                        disabled={isLoading}
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
                        disabled={isLoading}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{ color: 'black', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={e => setRememberMe(e.target.checked)}
                                style={{ marginRight: '0.3rem' }}
                                disabled={isLoading}
                            />
                            Remember me
                        </label>
                        <span
                            style={{
                                color: '#3b57acff',
                                fontSize: '0.9rem',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                alignSelf: 'flex-end'
                            }}
                            onClick={() => {
                                setShowForgotPassword(true);
                                setResetEmail('');
                                setResetMessage('');
                            }}
                        >
                            Forgot your password?
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            padding: '0.5rem',
                            background: isLoading ? 'linear-gradient(#b5a8eeff, #c6d1dbff)' : 'linear-gradient(#b5a8eeff, #61adecff)',
                            color: 'black',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            width: '100%',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                    <div style={{ color: 'black', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}> 
                        Don't have an account?{' '}
                        <span
                            style={{ color: '#3b57acff', cursor: 'pointer', textDecoration: 'underline' }}
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