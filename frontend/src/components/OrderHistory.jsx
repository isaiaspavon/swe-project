import React, { useState, useEffect } from 'react';
import "../pages/OrderHistoryPage.css";

const steps = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

const OrderHistory = () => {
  const [orders, setOrders] = useState([
    {
      id: '123456789',
      date: '2025-07-05',
      total: 99.99,
      status: 'Shipped',
      step: 2,
      books: [
        { title: 'The Great Gatsby', quantity: 1 },
        { title: '1984', quantity: 1 },
      ],
    },
    {
      id: '987654321',
      date: '2025-07-02',
      total: 149.49,
      status: 'Completed',
      step: 5,
      books: [
        { title: 'Sapiens', quantity: 1 },
        { title: 'Atomic Habits', quantity: 2 },
      ],
    },
  ]);

  useEffect(() => {
    // Fetch user's order history from Firebase
  }, []);

  return (
    <div className="order-tracker-container">
      <h2 className="order-tracking-header">Order Tracking</h2>
      <div className="order-container">
        {orders.map(order => (
          <div key={order.id} className="order-section">
            {/* Progress Tracker */}
            <div
              className={`progress-tracker ${order.step >= steps.length - 1 ? 'completed' : ''}`}
              style={{
                '--progress-percent': `${
                  order.step >= steps.length - 1 ? 100 : (order.step / (steps.length - 1)) * 100
                }%`,
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

            {/* Order Info */}
            <div className = "order-item-buttons-container">
              <div className="order-item">
                <div className="order-item-headers">
                  <p> Order # </p><div className="order-item-fill"><p>{order.id}</p></div></div>

                <div className="order-item-headers">
                  <p>Date Placed</p>
                  <div className="order-item-fill">
                    <p>{order.date}</p>
                  </div>
                </div>

                <div className="order-item-headers">
                  <p>Total Cost</p>
                  <div className="order-item-fill">
                    <p>${order.total}</p>
                  </div>
                </div>

                <div className="order-item-headers">
                  <p>Items</p>
                  <div className="order-item-fill">
                    <p>
                      {order.books.reduce((sum, book) => sum + book.quantity, 0)}
                    </p>
                  </div>
                </div>

                <div className="order-item-headers">
                  <p>Status</p>
                  <div className="order-item-fill">
                    <p>{order.status}</p>
                  </div>
                </div>
              </div>
              <div className = "order-button-container">
                <button className='view-order-button'> View Order</button>
                <button className='reorder-button'> Order Again </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory; 