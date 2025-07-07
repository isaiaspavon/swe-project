import React, { useState } from 'react';

const headerStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: 'black',
  textAlign: 'center',
  marginBottom: '22px',
  marginTop: '56.56px',
  letterSpacing: '0.01em',
};

const cardStyle = {
  background: '#232323',
  border: '1.5px solid #444',
  borderRadius: '8px',
  padding: '2rem',
  marginBottom: '2rem',
  color: 'white',
  width: '100%',
  maxWidth: '725px',
  marginLeft: 'auto',
  marginRight: 'auto',
  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
};
const sectionTitleStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: 'white',
};
const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  color: 'white',
};
const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1.2rem',
  color: 'white',
  fontWeight: 'normal',
  fontSize: '1.05rem',
};
const saveButtonStyle = {
  backgroundColor: '#2e7d32',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.7rem 2rem',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '1rem',
};

const EmailPreferences = () => {
  const [email] = useState('johndoe@email.com');
  const [prefs, setPrefs] = useState({
    assortment: true,
    nook: false,
    unsubscribe: false,
  });

  const handleChange = (key) => {
    if (key === 'unsubscribe') {
      setPrefs({ assortment: false, nook: false, unsubscribe: !prefs.unsubscribe });
    } else {
      setPrefs({ ...prefs, [key]: !prefs[key], unsubscribe: false });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', width: '100%' }}>
      <h2 style={headerStyle}>Email Preferences</h2>
      <form style={cardStyle}>
        <div style={sectionTitleStyle}>Marketing Email Preferences</div>
        <div style={{ color: '#bbb', marginBottom: '1.2rem' }}>Your Email Address: {email}</div>
        <label style={checkboxLabelStyle}>
          <input type="checkbox" checked={prefs.assortment} onChange={() => handleChange('assortment')} />
          Our email assortment
        </label>
        <div style={{ color: '#bbb', marginLeft: '2rem', marginBottom: '1rem', fontSize: '0.98rem' }}>
          Learn about the best new books and upcoming releases, get recommendations, ongoing offers, and more.
        </div>
        <label style={checkboxLabelStyle}>
          <input type="checkbox" checked={prefs.nook} onChange={() => handleChange('nook')} />
          Your Daily Finds
        </label>
        <div style={{ color: '#bbb', marginLeft: '2rem', marginBottom: '1rem', fontSize: '0.98rem' }}>
          Delivered to your inbox every day, this email features a great limited-time discount on a specially selected NOOK Book.
        </div>
        <label style={checkboxLabelStyle}>
          <input type="checkbox" checked={prefs.unsubscribe} onChange={() => handleChange('unsubscribe')} />
          Please unsubscribe me from all email.
        </label>
        <div style={{ color: '#bbb', marginLeft: '2rem', marginBottom: '1rem', fontSize: '0.98rem' }}>
          You will continue to receive emails regarding any orders you place (such as order and shipping confirmations).
        </div>
        <button type="button" style={saveButtonStyle}>Save Preferences</button>
      </form>
    </div>
  );
};

export default EmailPreferences; 