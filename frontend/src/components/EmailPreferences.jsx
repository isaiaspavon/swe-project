import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { db, auth } from '../firebaseConfig';

const headerStyle = {
  fontSize: '2rem', fontWeight: 'bold', color: 'black',
  textAlign: 'center', marginBottom: '22px', marginTop: '56.56px', letterSpacing: '0.01em',
};

const cardStyle = {
  background: '#232323', border: '1.5px solid #444', borderRadius: '8px',
  padding: '2rem', marginBottom: '2rem', color: 'white',
  width: '100%', maxWidth: '725px', marginLeft: 'auto', marginRight: 'auto',
  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
};

const questionStyle = {
  fontSize: '1.1rem',
  marginBottom: '1.5rem',
};

const saveButtonStyle = {
  backgroundColor: '#317ab5', color: 'white', border: 'none', borderRadius: '6px',
  padding: '0.7rem 2rem', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
};

const EmailPreferences = () => {
  const user = auth.currentUser;
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const promoRef = ref(db, `users/${user.uid}/promotions`);
    const unsubscribe = onValue(promoRef, (snapshot) => {
      const data = snapshot.val();
      setIsSubscribed(data?.subscribed === true);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const toggleSubscription = async () => {
    if (!user) return;
    try {
      await set(ref(db, `users/${user.uid}/promotions`), { subscribed: !isSubscribed });
      setIsSubscribed(!isSubscribed);
    } catch (err) {
      console.error('Failed to update subscription:', err);
      alert('Error updating preferences.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', alignItems: 'center', width: '100%' }}>
      <h2 style={headerStyle}>Promotions</h2>
      <div style={cardStyle}>
        <div style={questionStyle}>
          Would you like to receive promotional emails from us?
        </div>
        {!loading && (
          <button type="button" style={saveButtonStyle} onClick={toggleSubscription}>
            {isSubscribed ? 'Unregister' : 'Register'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailPreferences;
