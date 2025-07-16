import React, { useState, useEffect } from 'react';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { auth, db } from '../firebaseConfig';
import { encryptData, decryptData } from '../utils/encryption';

const headerStyle = {
  fontSize: '2rem', fontWeight: 'bold', color: 'black',
  textAlign: 'center', marginBottom: '22px', marginTop: '56.56px',
  letterSpacing: '0.01em',
};
const cardStyle = {
  background: '#232323', border: '1.5px solid #444',
  borderRadius: '8px', padding: '2rem', marginBottom: '2rem',
  color: 'white', width: '100%', maxWidth: '725px',
  marginLeft: 'auto', marginRight: 'auto',
  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
};
const sectionTitleStyle = {
  fontSize: '1.2rem', fontWeight: 'bold',
  marginBottom: '1rem', color: 'white',
};
const labelStyle = {
  display: 'block', marginBottom: '0.5rem',
  fontWeight: 'bold', color: 'white',
};
const inputStyle = {
  width: '96%', padding: '0.7rem',
  borderRadius: '6px', border: '1px solid #888',
  marginBottom: '1.2rem', fontSize: '1rem',
  background: '#181818', color: 'white',
};
const rowStyle = {
  display: 'flex', gap: '1rem', marginBottom: '1.2rem',
};
const smallInputStyle = { ...inputStyle, width: '100%', minWidth: '0' };
const checkboxLabelStyle = {
  display: 'flex', alignItems: 'center', gap: '0.5rem',
  marginBottom: '1.2rem', color: 'white', fontWeight: 'normal',
};
const saveButtonStyle = {
  backgroundColor: '#f5b5efff', color: 'white',
  border: 'none', borderRadius: '6px', padding: '0.7rem 2rem',
  fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
  marginTop: '1rem',
};
const deleteButtonStyle = {
  backgroundColor: '#b71c1c', color: 'white',
  border: 'none', borderRadius: '4px', padding: '0.4rem 1rem',
  cursor: 'pointer', marginTop: '0.5rem',
};

const PaymentMethods = () => {
  const [form, setForm] = useState({
    cardType: '', cardNumber: '', expMonth: '', expYear: '', default: false,
    billing: { first: '', last: '', mi: '', street: '', street2: '', city: '', zip: '', state: '', phone: '' },
  });
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const paymentCardsRef = ref(db, `paymentCards/${user.uid}`);
    const registrationCardRef = ref(db, `users/${user.uid}/payment`);

    const processCards = (paymentSnapshot, regSnapshot) => {
      const paymentData = paymentSnapshot?.val() || {};
      const registrationData = regSnapshot?.val() || {};

      const paymentCards = Object.entries(paymentData).map(([id, val]) => {
        let decryptedCardNumber = '';
        let decryptedExpDate = '';
        try {
          decryptedCardNumber = val.cardNumber ? decryptData(val.cardNumber) || val.cardNumber : '';
          decryptedExpDate = val.expDate ? decryptData(val.expDate) || val.expDate : '';
        } catch (err) {
          decryptedCardNumber = val.cardNumber || '';
          decryptedExpDate = val.expDate || '';
        }

        return {
          id,
          cardType: val.cardType || '',
          cardNumber: decryptedCardNumber,
          expDate: decryptedExpDate,
          default: val.default || false,
          billing: val.billing || {},
          source: 'Saved Manually',
        };
      });

      const cards = [...paymentCards];

      if (registrationData.cardNumber && registrationData.expDate) {
        try {
          cards.push({
            cardType: registrationData.cardType || '',
            cardNumber: decryptData(registrationData.cardNumber),
            expDate: decryptData(registrationData.expDate),
            default: false,
            source: 'Account Registration',
            id: 'accountRegistration',
          });
        } catch (err) {
          console.error('Decryption error:', err);
        }
      }

      const seen = new Set();
      const deduped = cards.filter(card => {
        const key = `${card.cardNumber}-${card.expDate}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      if (deduped.length === 1) {
        deduped[0].default = true;
      }

      setCards(deduped);
    };

    let paymentSnapshot = null;
    let regSnapshot = null;

    const updateIfReady = () => {
      if (paymentSnapshot !== null && regSnapshot !== null) {
        processCards(paymentSnapshot, regSnapshot);
      }
    };

    onValue(paymentCardsRef, (snap) => {
      paymentSnapshot = snap;
      updateIfReady();
    });

    onValue(registrationCardRef, (snap) => {
      regSnapshot = snap;
      updateIfReady();
    });
  }, [user]);

  const handleSave = async () => {
    setError('');

    const cardNumber = form.cardNumber.trim();
    if (!/^\d{15,16}$/.test(cardNumber)) {
      setError('Incorrect format');
      return;
    }
    if (!form.cardType || !form.expMonth || !form.expYear) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user) return;

    const userCardsRef = ref(db, `paymentCards/${user.uid}`);

    onValue(userCardsRef, async (snapshot) => {
      const existingCards = snapshot.val() || {};
      const cardCount = Object.keys(existingCards).length;

      if (cardCount >= 4) {
        alert("You can only save up to 4 payment cards.");
        return;
      }

      const cardData = {
        cardType: form.cardType,
        cardNumber: encryptData(cardNumber),
        expDate: encryptData(`${form.expMonth}/${form.expYear}`),
        default: false,
        billing: form.billing,
      };

      const shouldBeDefault = cardCount === 0 || form.default;

      if (shouldBeDefault) {
        const updates = {};
        for (const key in existingCards) {
          updates[`${key}/default`] = false;
        }
        await update(userCardsRef, updates);
        cardData.default = true;
      }

      const newCardRef = push(userCardsRef);
      await update(newCardRef, cardData);

      setForm({
        cardType: '', cardNumber: '', expMonth: '', expYear: '', default: false,
        billing: { first: '', last: '', mi: '', street: '', street2: '', city: '', zip: '', state: '', phone: '' },
      });
    }, { onlyOnce: true });
  };

  const handleDelete = async (cardId, isDefault) => {
    if (!user || !cardId) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this payment card?");
    if (!confirmDelete) return;

    const cardRef = ref(db, `paymentCards/${user.uid}/${cardId}`);
    await remove(cardRef);

    if (isDefault) {
      const userCardsRef = ref(db, `paymentCards/${user.uid}`);
      onValue(userCardsRef, async (snapshot) => {
        const cards = snapshot.val() || {};
        const keys = Object.keys(cards);
        if (keys.length > 0) {
          const firstKey = keys[0];
          await update(userCardsRef, { [`${firstKey}/default`]: true });
        }
      }, { onlyOnce: true });
    }
  };

  const maskCardNumber = (number) => {
    return number.replace(/.(?=.{4})/g, '*');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', width: '100%' }}>
      <h2 style={headerStyle}>Payment Methods</h2>
      <form style={cardStyle}>
        <div style={sectionTitleStyle}>Enter Payment Information</div>

        <label style={labelStyle}>Card Type <span style={{ color: 'red' }}>*</span></label>
        <select style={inputStyle} value={form.cardType} onChange={e => setForm({ ...form, cardType: e.target.value })}>
          <option value="">Select Card Type</option>
          <option value="Visa">Visa</option>
          <option value="MasterCard">MasterCard</option>
          <option value="American Express">American Express</option>
          <option value="Discover">Discover</option>
        </select>

        <label style={labelStyle}>Card Number <span style={{ color: 'red' }}>*</span></label>
        <input style={inputStyle} placeholder="Card number" value={form.cardNumber} onChange={e => setForm({ ...form, cardNumber: e.target.value })} />
        {error && <div style={{ color: 'red', marginTop: '-1rem', marginBottom: '1rem' }}>{error}</div>}

        <label style={labelStyle}>Expiration Date <span style={{ color: 'red' }}>*</span></label>
        <div style={rowStyle}>
          <select style={smallInputStyle} value={form.expMonth} onChange={e => setForm({ ...form, expMonth: e.target.value })}>
            <option value="">Month</option>
            {Array.from({ length: 12 }, (_, i) => {
              const val = String(i + 1).padStart(2, '0');
              return <option key={val} value={val}>{val}</option>;
            })}
          </select>
          <select style={smallInputStyle} value={form.expYear} onChange={e => setForm({ ...form, expYear: e.target.value })}>
            <option value="">Year</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <label style={checkboxLabelStyle}>
          <input type="checkbox" checked={form.default} onChange={e => setForm({ ...form, default: e.target.checked })} />
          Save as default Payment Method
        </label>

        <button type="button" style={saveButtonStyle} onClick={handleSave}>
          Save Payment Method
        </button>
      </form>

      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Saved Payment Cards</div>
        {cards.map((card, index) => (
          <div key={index} style={{ marginBottom: '1.2rem', background: '#1e1e1e', padding: '1rem', borderRadius: '6px' }}>
            <div><strong>Card Type:</strong> {card.cardType}</div>
            <div><strong>Card Number:</strong> {maskCardNumber(card.cardNumber)}</div>
            <div><strong>Expiration:</strong> {card.expDate}</div>
            <div><strong>Default:</strong> {card.default ? '✅' : '❌'}</div>
            {card.id && card.id !== 'accountRegistration' && (
              <button onClick={() => handleDelete(card.id, card.default)} style={deleteButtonStyle}>
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
