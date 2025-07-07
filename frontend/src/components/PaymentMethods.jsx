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
const inputStyle = {
  width: '96%',
  padding: '0.7rem',
  borderRadius: '6px',
  border: '1px solid #888',
  marginBottom: '1.2rem',
  fontSize: '1rem',
  background: '#181818',
  color: 'white',
};
const rowStyle = {
  display: 'flex',
  gap: '1rem',
  marginBottom: '1.2rem',
};
const smallInputStyle = {
  ...inputStyle,
  width: '100%',
  minWidth: '0',
};
const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginBottom: '1.2rem',
  color: 'white',
  fontWeight: 'normal',
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

const PaymentMethods = () => {
  const [form, setForm] = useState({
    cardType: '',
    cardNumber: '',
    expDate: '',
    default: false,
    billing: {
      first: '',
      last: '',
      mi: '',
      street: '',
      street2: '',
      city: '',
      zip: '',
      state: '',
      phone: '',
    },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', width: '100%' }}>
      <h2 style={headerStyle}>Payment Methods</h2>
      <form style={cardStyle}>
        <div style={sectionTitleStyle}>Enter Payment Information</div>
        <label style={labelStyle}>Card Type</label>
        <input style={inputStyle} placeholder="Card type" value={form.cardType} onChange={e => setForm({ ...form, cardType: e.target.value })} />
        <label style={labelStyle}>Card Number</label>
        <input style={inputStyle} placeholder="Card number" value={form.cardNumber} onChange={e => setForm({ ...form, cardNumber: e.target.value })} />
        <label style={labelStyle}>Expiration Date</label>
        <input style={inputStyle} placeholder="MM/YY" value={form.expDate} onChange={e => setForm({ ...form, expDate: e.target.value })} />
        <label style={checkboxLabelStyle}>
          <input type="checkbox" checked={form.default} onChange={e => setForm({ ...form, default: e.target.checked })} />
          Save as default Payment Method
        </label>
        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1.5px solid #888' }} />
        <div style={sectionTitleStyle}>Billing Address</div>
        <div style={rowStyle}>
          <input style={smallInputStyle} placeholder="First Name" value={form.billing.first} onChange={e => setForm({ ...form, billing: { ...form.billing, first: e.target.value } })} />
          <input style={smallInputStyle} placeholder="Last Name" value={form.billing.last} onChange={e => setForm({ ...form, billing: { ...form.billing, last: e.target.value } })} />
          <input style={{ ...smallInputStyle, maxWidth: '60px' }} placeholder="MI" value={form.billing.mi} onChange={e => setForm({ ...form, billing: { ...form.billing, mi: e.target.value } })} />
        </div>
        <input style={inputStyle} placeholder="Street Address" value={form.billing.street} onChange={e => setForm({ ...form, billing: { ...form.billing, street: e.target.value } })} />
        <input style={inputStyle} placeholder="Street Address 2 (optional)" value={form.billing.street2} onChange={e => setForm({ ...form, billing: { ...form.billing, street2: e.target.value } })} />
        <div style={rowStyle}>
          <input style={smallInputStyle} placeholder="City" value={form.billing.city} onChange={e => setForm({ ...form, billing: { ...form.billing, city: e.target.value } })} />
          <input style={smallInputStyle} placeholder="Zip" value={form.billing.zip} onChange={e => setForm({ ...form, billing: { ...form.billing, zip: e.target.value } })} />
          <input style={smallInputStyle} placeholder="State" value={form.billing.state} onChange={e => setForm({ ...form, billing: { ...form.billing, state: e.target.value } })} />
        </div>
        <input style={inputStyle} placeholder="Phone Number" value={form.billing.phone} onChange={e => setForm({ ...form, billing: { ...form.billing, phone: e.target.value } })} />
        <button type="button" style={saveButtonStyle}>Save Payment Method</button>
      </form>
    </div>
  );
};

export default PaymentMethods; 