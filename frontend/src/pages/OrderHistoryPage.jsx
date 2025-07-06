// pages/OrderHistoryPage.jsx
import React, { useState, useEffect } from 'react';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch user's order history from Firebase
  }, []);

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {orders.map(order => (
        <div key={order.id} className="order-item">
          <h3>Order #{order.id}</h3>
          <p>Date: {order.date}</p>
          <p>Total: ${order.total}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};