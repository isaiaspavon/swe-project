// This file establishes a secure route that only admins can access
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        background: '#18181b',
        color: '#f4f4f5',
        minHeight: '80vh'
      }}>
        <h1 style={{ color: '#facc15' }}>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Only administrators can access the admin dashboard.</p>
      </div>
    );
  }

  return children;
};

export default AdminRoute;