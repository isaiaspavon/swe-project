import React, { useState, useEffect } from 'react';
import { ref, push, onValue, update } from 'firebase/database';
import { auth, db } from '../firebaseConfig';
import { decryptData } from '../utils/encryption'; // Make sure this exists

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
    expMonth: '',
    expYear: '',
    default: false,
    billing: {
      first: '', last: '', mi: '', street: '', street2: '', city: '', zip: '', state: '', phone: '',
    },
  });
  const [cards, setCards] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const cardRef = ref(db, `paymentCards/${user.uid}`);
    const userPaymentRef = ref(db, `users/${user.uid}/payment`);

    // Fetch cards saved in paymentCards/
    onValue(cardRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loaded = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setCards(prev => {
        const ids = new Set(loaded.map(card => card.id));
        return [...prev.filter(card => !ids.has(card.id)), ...loaded];
      });
    });

    // Fetch card saved during account registration
    onValue(userPaymentRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.cardNumber && data.expDate) {
        try {
          const decryptedCard = {
            cardType: data.cardType || '',
            cardNumber: decryptData(data.cardNumber),
            expDate: decryptData(data.expDate),
            default: false,
            source: 'Account Registration',
            id: 'accountRegistration',
          };
          setCards(prev => {
            const exists = prev.find(c => c.id === 'accountRegistration');
            if (exists) return prev;
            return [...prev, decryptedCard];
          });
        } catch (error) {
          console.error("Decryption failed for registered card:", error);
        }
      }
    });
  }, [user]);

  const handleSave = async () => {
    const cardData = {
      ...form,
      expDate: `${form.expMonth}/${form.expYear}`,
    };

    const userRef = ref(db, `paymentCards/${user.uid}`);
    const newCardRef = push(userRef);
    await update(newCardRef, cardData);
  };

  const maskCardNumber = (number) => {
    return number.replace(/.(?=.{4})/g, '*');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', width: '100%' }}>
      <h2 style={headerStyle}>Payment Methods</h2>
      <form style={cardStyle}>
        <div style={sectionTitleStyle}>Enter Payment Information</div>

        <label style={labelStyle}>Card Type</label>
        <select
          style={inputStyle}
          value={form.cardType}
          onChange={e => setForm({ ...form, cardType: e.target.value })}
        >
          <option value="">Select Card Type</option>
          <option value="Visa">Visa</option>
          <option value="MasterCard">MasterCard</option>
          <option value="American Express">American Express</option>
          <option value="Discover">Discover</option>
        </select>

        <label style={labelStyle}>Card Number</label>
        <input
          style={inputStyle}
          placeholder="Card number"
          value={form.cardNumber}
          onChange={e => setForm({ ...form, cardNumber: e.target.value })}
        />

        <label style={labelStyle}>Expiration Date</label>
        <div style={rowStyle}>
          <select
            style={smallInputStyle}
            value={form.expMonth}
            onChange={e => setForm({ ...form, expMonth: e.target.value })}
          >
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={String(i + 1).padStart(2, '0')}>
                {String(i + 1).padStart(2, '0')}
              </option>
            ))}
          </select>
          <select
            style={smallInputStyle}
            value={form.expYear}
            onChange={e => setForm({ ...form, expYear: e.target.value })}
          >
            <option value="">Year</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <label style={checkboxLabelStyle}>
          <input
            type="checkbox"
            checked={form.default}
            onChange={e => setForm({ ...form, default: e.target.checked })}
          />
          Save as default Payment Method
        </label>

        <button type="button" style={saveButtonStyle} onClick={handleSave}>
          Save Payment Method
        </button>
      </form>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Saved Payment Cards</div>
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              marginBottom: '1.2rem',
              background: '#1e1e1e',
              padding: '1rem',
              borderRadius: '6px'
            }}
          >
            <div><strong>Card Type:</strong> {card.cardType}</div>
            <div><strong>Card Number:</strong> {maskCardNumber(card.cardNumber)}</div>
            <div><strong>Expiration:</strong> {card.expDate}</div>
            <div><strong>Default:</strong> {card.default ? '✅' : '❌'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
