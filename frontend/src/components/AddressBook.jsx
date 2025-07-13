import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ref, push, onValue, remove } from 'firebase/database';
import { db } from '../firebaseConfig';
import { formatPhone } from '../utils/formatPhone';

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
  const {currentUser } = useAuth();
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
  const [addresses, setAddresses] = useState([]);

  // Load saved addresses
  useEffect(() => {
    if (!currentUser) return;
    const addrRef = ref(db, `addresses/${currentUser.uid}`);
    const unsubscribe = onValue(addrRef, snap => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, addr]) => ({ id, ...addr }));
      setAddresses(list);
    });
    return () => unsubscribe();
  }, [currentUser]);

   // Save new address
  const handleSave = async () => {
    if (!currentUser) return alert('Sign in to save an address.');
    if (!form.first || !form.last || !form.street || !form.city || !form.zip) {
      return alert('Please fill in required fields.');
    }
    try {
      await push(ref(db, `addresses/${currentUser.uid}`), form);
      alert('Address saved!');
      setForm({ first:'', last:'', mi:'', street:'', street2:'', city:'', zip:'', state:'', phone:'' });
    } catch (err) {
      console.error(err);
      alert('Failed to save address: ' + err.message);
    }
  };

 const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await remove(ref(db, `addresses/${currentUser.uid}/${id}`));
      // Firebase onValue listener will update your state automatically
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Could not delete address');
    }
  };

return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%' }}>
      <h2 style={headerStyle}>Address Book</h2>
      <form style={cardStyle} onSubmit={e => e.preventDefault()}>
        <div style={sectionTitleStyle}>Add a New Shipping</div>
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
        <button type="button" style={saveButtonStyle} onClick={handleSave}>Save Address</button>
      </form>
    
    <h3 style={headerStyle}>Saved Addresses</h3> 
      {addresses.length > 0 && (
        <div style={{ width:'100%', maxWidth:'800px', margin:'0 auto' }}>
          <ul style={{ listStyle:'none', padding:0 }}>
            {addresses.map(addr => (
              <li key={addr.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center', background:'#1e1e1e', color:'white', padding:'1rem', borderRadius:'6px', marginBottom:'1rem' }}>
               <div>
                <strong>{addr.first} {addr.mi && `${addr.mi}.`} {addr.last}</strong><br/>
            {addr.street}{addr.street2 && `, ${addr.street2}`}<br/>
            {addr.city}, {addr.state} {addr.zip}<br/>
            {addr.phone && `Phone: ${formatPhone(addr.phone)}`}
          </div>
          <button
            onClick={() => handleDelete(addr.id)}
            style={{
              background: 'transparent',
              border: '1px solid #f44336',
              color: '#f44336',
              borderRadius: '4px',
              padding: '0.4rem 0.8rem',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}>Delete</button>  
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddressBook; 