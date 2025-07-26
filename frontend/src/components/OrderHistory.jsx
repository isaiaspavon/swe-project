import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ref, onValue, off } from 'firebase/database';
import { db } from '../firebaseConfig';
import "../pages/OrderHistoryPage.css";

const steps = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const { addOrUpdateCartBook, getCartBooks } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOrder, setModalOrder] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
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
          step: getStepFromStatus(orderData.status),
        }));
        ordersList.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(ordersList);
      } else {
        setOrders([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });
    return () => off(ordersRef, 'value', unsubscribe);
  }, [currentUser]);

  const getStepFromStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed': return 0;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'out for delivery': return 3;
      case 'delivered':
      case 'completed': return 4;
      default: return 0;
    }
  };

  const handleViewOrder = (order) => setModalOrder(order);

 const handleOrderAgain = (order) => {
  const cartBooks = getCartBooks() || [];

  if (order.items && Array.isArray(order.items)) {
    order.items.forEach(item => {
      const existing = cartBooks.find(cartItem => cartItem.bookId === item.bookId);
      const newQuantity = existing
        ? existing.quantity + (item.quantity || 1)
        : (item.quantity || 1);

      addOrUpdateCartBook(item.bookId, newQuantity);
    });

    alert('Items from this order have been added to your cart!');
    navigate('/cart');
  }
};

  const handleContinueShopping = () => navigate('/');

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}><p>Loading order history...</p></div>;
  }

  if (!currentUser) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}><p>Please sign in to view your order history.</p></div>;
  }

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.8rem' }}>No orders have been placed yet</h2>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem', color: 'white', lineHeight: '1.5' }}>
          Start exploring our collection of books and place your first order to see your order history here!
        </p>
        <button
          onClick={handleContinueShopping}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: 'linear-gradient(#1d91f0ff,hsl(207, 65.80%, 54.10%))',
            backgroundImage: 'linear-gradient(rgb(29, 145, 240), rgb(61, 146, 215))',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="order-tracker-container" style={{ padding: '2rem 0'  }}>
      <h2 className="order-tracking-header" style={{color: 'white'}}>Order History</h2>
      <div className="order-container" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {orders.map(order => (
          <div key={order.id} className="order-section" style={{
            background: '#232323',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            padding: '2rem',
            marginBottom: '1.5rem',
            color: 'white',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            
          <div className={`progress-tracker ${order.step >= steps.length - 1 ? 'completed' : ''}`}
                style={{
                  marginBottom: '2rem',
                  '--progress-percent': `${
                    order.step === 0
                      ? 10 
                      : (order.step / (steps.length - 1)) * 100
                  }%`
                }}
              >
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`step 
                    ${index < order.step ? 'completed' : ''} 
                    ${index === order.step ? 'current' : ''}`}
                >
                  <div className="step-number">
                    {index < order.step ? '✓' : ''}
                  </div>
                  <div className="step-label">{step}</div>
                </div>
              ))}
            </div>
           
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem'
            }}>
              <div style={{
                display: 'flex',
                flex: 1,
                flexWrap: 'wrap',
                gap: '2.5rem',
                minWidth: '350px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>Order #</div>
                  <div style={{ wordBreak: 'break-all', fontSize: '1rem' }}>{order.id}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>Date Placed</div>
                  <div style={{ fontSize: '1rem' }}>{order.date}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>Total Cost</div>
                  <div style={{ fontSize: '1rem' }}>${order.total?.toFixed(2) || '0.00'}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>Items</div>
                  <div style={{ fontSize: '1rem' }}>{order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}</div>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>Status</div>
                  <div style={{ fontSize: '1rem' }}>{order.status || 'Placed'}</div>
                </div>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minWidth: '180px',
                alignItems: 'stretch',
                justifyContent: 'center'
              }}>
                <button
                  style={{
                    background: 'linear-gradient(#1d91f0ff, #3d92d7ff)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.8rem 0',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                    width: '100%'
                  }}
                  onClick={() => handleViewOrder(order)}
                >
                  View Order
                </button>
                <button
                  style={{
                    background: 'linear-gradient(#1d91f0ff, #3d92d7ff)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.8rem 0',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                  onClick={() => handleOrderAgain(order)}
                >
                  Order Again
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for View Order */}
      {modalOrder && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            color: '#232323',
            borderRadius: '12px',
            padding: '2rem',
            minWidth: '350px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            position: 'relative'
          }}>
            <button
              onClick={() => setModalOrder(null)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                width: '32px',          
                height: '32px',         
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                color: '#232323',
                cursor: 'pointer',
                display: 'flex',        
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,           
                padding: 0              
              }}
              aria-label="Close"
            >×</button>
            <h2 style={{ marginBottom: '1rem', color: '#2986d2ff' }}>Order Details</h2>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Order #:</strong> {modalOrder.id}<br />
              <strong>Date Placed:</strong> {modalOrder.date}<br />
              <strong>Status:</strong> {modalOrder.status || 'Placed'}<br />
              <strong>Total:</strong> ${modalOrder.total?.toFixed(2) || '0.00'}
            </div>
            <div>
              <strong>Items:</strong>
              <ul>
                {modalOrder.items?.map((item, idx) => (
                  <li key={idx}>
                    {item.title} by {item.author} — Qty: {item.quantity} — ${item.price?.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <strong>Shipping Info:</strong>
              <div style={{ fontSize: '0.98rem', color: '#444' }}>
                {modalOrder.shipping?.firstName} {modalOrder.shipping?.lastName}<br />
                {[
                  modalOrder.shipping?.addressLine1,
                  modalOrder.shipping?.addressLine2,
                  modalOrder.shipping?.city,
                  modalOrder.shipping?.state,
                  modalOrder.shipping?.zipCode
                ]
                  .filter(Boolean) // Remove empty/null/undefined values
                  .join(', ')}<br />
                {modalOrder.shipping?.email}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;