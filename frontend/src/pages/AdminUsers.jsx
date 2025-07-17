import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { db } from '../firebaseConfig';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from Firebase
  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersList = Object.entries(usersData).map(([id, user]) => ({
          id,
          ...user,
        }));
        setUsers(usersList);
      } else {
        setUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { status: newStatus });
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, { role: newRole });
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading users...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: '#18181b', color: '#f4f4f5', minHeight: '100vh' }}>
      <Link to="/admin" style={{ color: '#facc15', textDecoration: 'underline' }}>← Back to Dashboard</Link>
      <h2 style={{ color: '#facc15' }}>Manage Users</h2>
      
      <table style={{ width: '100%', background: '#232323', color: '#f4f4f5', borderRadius: 8, marginTop: '1rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Phone</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Status</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Role</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Created</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ padding: 8 }}>{user.name || 'N/A'}</td>
              <td style={{ padding: 8 }}>{user.email || 'N/A'}</td>
              <td style={{ padding: 8 }}>{user.phone || 'N/A'}</td>
              <td style={{ padding: 8 }}>
                <select 
                  value={user.status || 'Inactive'} 
                  onChange={(e) => handleStatusChange(user.id, e.target.value)}
                  style={{ 
                    padding: '0.25rem', 
                    borderRadius: '4px', 
                    border: '1px solid #444',
                    background: user.status === 'Active' ? '#2e7d32' : '#dc2626',
                    color: 'white'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </td>
              <td style={{ padding: 8 }}>
                <select 
                  value={user.role || 'user'} 
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  style={{ 
                    padding: '0.25rem', 
                    borderRadius: '4px', 
                    border: '1px solid #444',
                    background: user.role === 'admin' ? '#facc15' : '#666',
                    color: user.role === 'admin' ? 'black' : 'white'
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td style={{ padding: 8 }}>
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </td>
              <td style={{ padding: 8 }}>
                <span style={{ 
                  color: user.status === 'Active' ? '#2e7d32' : '#dc2626',
                  fontWeight: 'bold'
                }}>
                  {user.status || 'Inactive'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          No users found.
        </div>
      )}
    </div>
  );
};

export default AdminUsers;