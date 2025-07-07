import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard" style={{
      padding: '2rem',
      minHeight: '80vh',
      background: '#18181b',
      color: '#f4f4f5'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#facc15' }}>
        Admin Dashboard
      </h1>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <Link to="/admin/books" style={adminCardStyle}>
          <h3>Manage Books</h3>
          <p>Add, edit, or remove books from inventory</p>
        </Link>
        <Link to="/admin/users" style={adminCardStyle}>
          <h3>Manage Users</h3>
          <p>View and manage user accounts</p>
        </Link>
        <Link to="/admin/promotions" style={adminCardStyle}>
          <h3>Manage Promotions</h3>
          <p>Create and manage promotional offers</p>
        </Link>
      </div>
    </div>
  );
};

const adminCardStyle = {
  background: '#232323',
  color: '#f4f4f5',
  borderRadius: '12px',
  padding: '2rem 2.5rem',
  minWidth: '220px',
  textAlign: 'center',
  textDecoration: 'none',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  fontWeight: 500,
  fontSize: '1.1rem',
  marginBottom: '1rem'
};

export default AdminDashboard;