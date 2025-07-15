import React, {useState, useEffect} from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatPhone } from '../utils/formatPhone';
import { ref, onValue, off, get } from 'firebase/database';
import { db } from '../firebaseConfig';

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
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const userRef = ref(db, `users/${currentUser.uid}`);
    const unsubscribe = onValue(userRef, snap => {
      if (snap.exists()) {
        setUserProfile(snap.val());
      }
    });
    return () => off(userRef, 'value', unsubscribe);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const addrRef = ref(db, `addresses/${currentUser.uid}`);
    const unsubscribe = onValue(addrRef, snap => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, addr]) => ({ id, ...addr }));
      setAddresses(list);
    });
    return () => off(addrRef, 'value', unsubscribe);
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      setRecentOrders([]);
      setLoadingOrders(false);
      return;
    }
    const ordersRef = ref(db, `orders/${currentUser.uid}`);
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const ordersList = Object.entries(ordersData).map(([orderId, orderData]) => ({
          id: orderId,
          ...orderData,
          date: orderData.orderDate ? new Date(orderData.orderDate).toLocaleDateString() : 'Unknown',
        }));
        ordersList.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setRecentOrders(ordersList.slice(0, 2));
      } else {
        setRecentOrders([]);
      }
      setLoadingOrders(false);
    });
    return () => off(ordersRef, 'value', unsubscribe);
  }, [currentUser]);

  return (
  <div>
    <h2 style={headerStyle}>My Account</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Order History</h2>
        <div style={{ margin: '0.5rem 0 1rem 0', minHeight: 40 }}>
          {loadingOrders ? (
            <span>Loading recent orders...</span>
          ) : recentOrders.length === 0 ? (
            <>
              <span>Recent Order(s)</span>
              <br />
              <span>We could not find any recent orders.</span>
            </>
          ) : (
            <>
              <span>Recent Order(s):</span>
              <ul style={{ margin: '0.5rem 0 0 1.2rem', color: '#facc15', fontSize: '1rem' }}>
                {recentOrders.map(order => (
                  <li key={order.id}>
                    <span style={{ fontWeight: 500 }}>Order #{order.id}</span> — {order.date} — ${order.total?.toFixed(2) || '0.00'}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <button style={buttonStyle} onClick={() => onNavigate('orders')}>See All Orders</button>
      </div>

      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Account Settings</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          Full Name: {userProfile?.name || 'Not Set'}<br />
          Email Address: {currentUser?.email || 'Not Set'}<br />
          Phone Number:{' '}
          {userProfile?.phone ? formatPhone(userProfile.phone) : (
            <span style={{ color: '#b71c1c' }}>Add a number to assure account security</span>
          )}<br />
        </p>
        <button style={buttonStyle} onClick={() => onNavigate('settings')}>Manage Account Settings</button>
      </div>

      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Address Book</h2>
        {addresses.length === 0 ? (
          <p style={{ margin: '0.5rem 0 0 0', color: '#bbb' }}>You haven't added any addresses yet.</p>
        ) : (
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0.5rem 0',
            maxHeight: '8rem',
            overflowY: 'auto'
          }}>
            {addresses.map(addr => (
              <li key={addr.id} style={{ marginBottom: '0.75rem' }}>
                <strong>
                  {addr.first} {addr.mi && `${addr.mi}.`} {addr.last}
                </strong><br/>
                {addr.street}{addr.street2 && `, ${addr.street2}`}<br/>
                {addr.city}, {addr.state} {addr.zip}<br/>
                {addr.phone && (
                  <span>Phone: {formatPhone(addr.phone)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
        <button style={buttonStyle} onClick={() => onNavigate('address')}>Manage Address Book</button>
      </div>

      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Payment Methods</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>Add a New Payment Method</p>
        <button style={buttonStyle} onClick={() => onNavigate('payments')}>Manage Payment Methods</button>
      </div>

      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>Promotions</h2>
        <p style={{ margin: '0.5rem 0 0 0' }}>Manage the types of emails you receive from us.</p>
        <button style={buttonStyle} onClick={() => onNavigate('email')}>Manage Email Preferences</button>
      </div>
    </div>
  </div>
  );
};

export default AccountOverview;