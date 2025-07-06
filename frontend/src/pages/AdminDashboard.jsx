// pages/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="admin-menu">
        <Link to="/admin/books" className="admin-card">
          <h3>Manage Books</h3>
          <p>Add, edit, or remove books from inventory</p>
        </Link>
        <Link to="/admin/users" className="admin-card">
          <h3>Manage Users</h3>
          <p>View and manage user accounts</p>
        </Link>
        <Link to="/admin/promotions" className="admin-card">
          <h3>Manage Promotions</h3>
          <p>Create and manage promotional offers</p>
        </Link>
      </div>
    </div>
  );
};