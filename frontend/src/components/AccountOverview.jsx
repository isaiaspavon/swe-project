import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function formatPhone(number = '') {
  // Strip out anything that isn't a digit
  const digits = number.replace(/\D/g, '');
  // If it’s not exactly 10 digits, just return the raw string
  if (digits.length !== 10) return number;
  const [area, prefix, line] = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 10),
  ];
  return `(${area})-${prefix}-${line}`;
}

const headerStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: '58px',
    marginTop: '56.56px',
    letterSpacing: '0.01em',
  };

const cardStyle = {
  background: '#232323',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1.5rem',
  marginBottom: '1.5rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  minWidth: '280px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const buttonStyle = {
  marginTop: '1rem',
  background: '#2e7d32',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const AccountOverview = ({ onNavigate }) => {
  const { currentUser, userProfile } = useAuth();
  
  return (
  <div>
    <h2 style={headerStyle}>My Account</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
      {/* Order History Card */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Order History</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>Recent Order(s)<br />We could not find any recent orders.</p>
        <button style={buttonStyle} onClick={() => onNavigate('orders')}>See All Orders</button>
      </div>

      {/* Account Settings Card */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Account Settings</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          Full Name: {userProfile?.name || 'Not Set'}<br />
          Email Address: {currentUser?.email || 'Not Set'}<br />
          Phone Number:{' '}
          {userProfile?.phone
             ? formatPhone(userProfile.phone)
              : (
                <span style={{ color: '#b71c1c' }}>
                 Add a number to assure account security
                </span>
              )
            }<br />
        </p>
        <button style={buttonStyle} onClick={() => onNavigate('settings')}>Manage Account Settings</button>
      </div>

      {/* Address Book Card */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Address Book</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>Add New Address</p>
        <button style={buttonStyle} onClick={() => onNavigate('address')}>Manage Address Book</button>
      </div>

      {/* Payment Methods Card */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Payment Methods</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>Add a New Payment Method</p>
        <button style={buttonStyle} onClick={() => onNavigate('payments')}>Manage Payment Methods</button>
      </div>

      {/* Email Preferences Card */}
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Email Preferences</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>Manage the types of emails you receive from us.</p>
        <button style={buttonStyle} onClick={() => onNavigate('email')}>Manage Email Preferences</button>
      </div>
    </div>
  </div>
  );
};

export default AccountOverview; 