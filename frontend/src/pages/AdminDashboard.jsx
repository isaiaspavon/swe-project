import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard" style={{
      padding:'1rem 1rem 0.5rem 1rem',
      minHeight: '80vh',
      background: 'transparent',
      color: '#f4f4f5',
      marginTop: '2rem'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', backgroundImage: 'linear-gradient(#b5a8eeff, #f6a0edff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    fontSize: '3.2 rem' }}>
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
  border:'0.5px solid white',
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