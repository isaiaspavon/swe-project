import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ref, update, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';
import { formatPhone } from '../utils/formatPhone';
import { add } from 'ogl/src/math/functions/Mat4Func.js';

const headerStyle = {
  fontSize: '2rem', fontWeight: 'bold', color: 'black',
  textAlign: 'center', marginBottom: '22px', marginTop: '56.56px',
  letterSpacing: '0.01em',
};

const cardStyle = {
  background: '#232323', border: '1.5px solid #444', borderRadius: '8px',
  padding: '2rem', marginBottom: '2rem', color: 'white',
  width: '100%', maxWidth: '725px', marginLeft: 'auto', marginRight: 'auto',
  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
};

const labelStyle = {
  display: 'block', marginBottom: '0.5rem',
  fontWeight: 'bold', color: 'white',
};

const inputStyle = {
  width: '96%', padding: '0.7rem', borderRadius: '6px',
  border: '1px solid #888', marginBottom: '1.2rem', fontSize: '1rem',
  background: '#181818', color: 'white',
};

const rowStyle = {
  display: 'flex', gap: '1rem', marginBottom: '1.2rem',
};

const saveButtonStyle = {
  background: '#317ab5', color: 'white', border: 'none',
  borderRadius: '6px', padding: '0.7rem 2rem', fontWeight: 'bold',
  fontSize: '1rem', cursor: 'pointer', marginTop: '1rem',
};

const editButtonStyle = {
  background: '#317ab5', border: 'none', color: 'white', fontWeight: 'bold',
  padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', marginLeft: '1rem'
};

const AddressBook = () => {
  const { currentUser } = useAuth();
  const [address, setAddress] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', street: '', street2: '', city: '', zip: '', state: '', phone: '',
  });

  useEffect(() => {
    if (!currentUser) return;
    const userRef = ref(db, `users/${currentUser.uid}/address`);

    onValue(userRef, (snap) => {
      const userData = snap.val() || {};
      const regAddr = userData.address || {};
      
      // Fix: Split the full name into first and last
      const nameParts = (userData.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setAddress({
        firstName: firstName,
        lastName: lastName,
        street: regAddr.street || '',
        street2: regAddr.street2 || '',
        city: regAddr.city || '',
        zip: regAddr.zip || '',
        state: regAddr.state || '',
        phone: userData.phone || '',
      });
    });
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) return alert('Sign in to save your address.');
    const { firstName, lastName, phone, street, city, zip, state } = form;

    if (!firstName || !lastName || !phone || !street || !city || !zip) {
      return alert('Please fill in all required fields.');
    }

    if (!/^[A-Za-z\s]+$/.test(firstName) || !/^[A-Za-z\s]+$/.test(lastName)) {
      return alert('Name fields can only contain letters and spaces.');
    }

    if (!/^\d{10}$/.test(phone)) {
      return alert('Phone number must be exactly 10 digits (numbers only).');
    }

    if (!/^\d+$/.test(zip)) {
      return alert('Zip code can only contain numbers.');
    }

    if (!/^[A-Za-z\s-]+$/.test(city)) {
      return alert('City can only contain letters, spaces, or dashes.');
    }

    if (state && !/^[A-Za-z\s-]+$/.test(state)) {
      return alert('State can only contain letters, spaces, or dashes.');
    }

    try {
      // Fix: Save full name as single string
      const fullName = `${firstName} ${lastName}`;
      
      await update(ref(db, `users/${currentUser.uid}/address`), {
        name: fullName, // Save as single name field
        phone,
        
        street: form.street,
        street2: form.street2,
        city: form.city,
        zip: form.zip,
        state: form.state,
        
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save address: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', width: '100%' }}>
      <h2 style={headerStyle}>Shipping Address</h2>

    {editing ? (
      // 1) EDIT MODE: always show the form
      <form style={cardStyle} onSubmit={e => e.preventDefault()}>
          <label style={labelStyle}>First Name *</label>
          <input style={inputStyle} placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />

          <label style={labelStyle}>Last Name *</label>
          <input style={inputStyle} placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />

          <label style={labelStyle}>Street Address *</label>
          <input style={inputStyle} placeholder="Street Address" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />

          <label style={labelStyle}>Street Address 2 (optional)</label>
          <input style={inputStyle} placeholder="Apt, Suite, etc." value={form.street2} onChange={e => setForm({ ...form, street2: e.target.value })} />

          <div style={rowStyle}>
            <input style={inputStyle} placeholder="City *" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            <input style={inputStyle} placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
            <input style={inputStyle} placeholder="Zip Code *" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} />
          </div>

          <label style={labelStyle}>Phone Number *</label>
          <input style={inputStyle} placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

          <button type="button" style={saveButtonStyle} onClick={handleSave}>Save Address</button>
      </form>

    ) : !address?.street ? (
      // 2) NO ADDRESS SAVED: show placeholder
      <div style={cardStyle}>
        <p style={{ color: '#bbb', margin: 0 }}>
          You haven’t added a shipping address yet.
        </p>
        <button style={saveButtonStyle} onClick={() => setEditing(true)}>Add Address</button>
      </div>
        
    ) : (
        <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{address.firstName} {address.lastName}</strong><br />

            {address.street}{address.street2 && `, ${address.street2}`}<br />
            {(address.city || address.state || address.zip) && (
            <>
              {address.city}
              {address.city && address.state && ', '}
              {address.state}
              {address.zip && ` ${address.zip}`}
              <br/>
            </>
          )}
            {address.phone && `Phone: ${formatPhone(address.phone)}`}
          </div>
          <button style={editButtonStyle} onClick={() => {
            setForm(address);
            setEditing(true);
          }}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default AddressBook;