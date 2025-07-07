import React from 'react';

const sidebarOptions = [
  { key: 'account', label: 'My Account' },
  { key: 'orders', label: 'Order History' },
  { key: 'settings', label: 'Account Settings' },
  { key: 'payments', label: 'Payment Methods' },
  { key: 'address', label: 'Address Book' },
  { key: 'email', label: 'Email Preferences' },
];

const AccountSidebar = ({ activeSection, onSelect }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: '1.5rem 1rem',
      background: '#f5f5f5',
      borderRadius: '8px',
      minWidth: '180px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}>
      {sidebarOptions.map(opt => (
        <button
          key={opt.key}
          onClick={() => onSelect(opt.key)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            border: 'none',
            background: activeSection === opt.key ? '#2e7d32' : '#fff',
            color: activeSection === opt.key ? 'white' : '#222',
            fontWeight: activeSection === opt.key ? 'bold' : 'normal',
            cursor: 'pointer',
            boxShadow: activeSection === opt.key ? '0 2px 8px rgba(46,125,50,0.08)' : 'none',
            transition: 'background 0.2s, color 0.2s',
            outline: 'none',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default AccountSidebar; 