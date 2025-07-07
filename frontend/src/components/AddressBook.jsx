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

const AddressBook = () => {
  const [form, setForm] = useState({
    first: '',
    last: '',
    mi: '',
    street: '',
    street2: '',
    city: '',
    zip: '',
    state: '',
    phone: '',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', width: '100%' }}>
      <h2 style={headerStyle}>Address Book</h2>
      <form style={cardStyle}>
        <div style={sectionTitleStyle}>Add a New Shipping Address</div>
        <div style={rowStyle}>
          <input style={smallInputStyle} placeholder="First Name" value={form.first} onChange={e => setForm({ ...form, first: e.target.value })} />
          <input style={smallInputStyle} placeholder="Last Name" value={form.last} onChange={e => setForm({ ...form, last: e.target.value })} />
          <input style={{ ...smallInputStyle, maxWidth: '60px' }} placeholder="MI" value={form.mi} onChange={e => setForm({ ...form, mi: e.target.value })} />
        </div>
        <input style={inputStyle} placeholder="Street Address" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
        <input style={inputStyle} placeholder="Street Address 2 (optional)" value={form.street2} onChange={e => setForm({ ...form, street2: e.target.value })} />
        <div style={rowStyle}>
          <input style={smallInputStyle} placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          <input style={smallInputStyle} placeholder="Zip" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} />
          <input style={smallInputStyle} placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
        </div>
        <input style={inputStyle} placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <button type="button" style={saveButtonStyle}>Save Address</button>
      </form>
    </div>
  );
};

export default AddressBook; 