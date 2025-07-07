import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialUsers = [
  { id: 'user1', name: 'Alice', email: 'alice@example.com' },
  { id: 'user2', name: 'Bob', email: 'bob@example.com' }
];

const AdminUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setUsers([...users, { id: `user${Date.now()}`, ...form }]);
    setForm({ name: '', email: '' });
  };

  const handleEdit = user => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email });
  };

  const handleUpdate = e => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editingId ? { ...u, ...form } : u));
    setEditingId(null);
    setForm({ name: '', email: '' });
  };

  const handleDelete = id => setUsers(users.filter(u => u.id !== id));

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/admin" style={{ color: '#facc15', textDecoration: 'underline' }}>← Back to Dashboard</Link>
      <h2>Manage Users</h2>
      <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ marginBottom: '1.5rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ marginRight: 8 }} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ marginRight: 8 }} />
        <button type="submit" style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1rem' }}>
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', email: '' }); }} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </form>
      <table style={{ width: '100%', background: '#232323', color: '#f4f4f5', borderRadius: 8 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ padding: 8 }}>{user.name}</td>
              <td style={{ padding: 8 }}>{user.email}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleEdit(user)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(user.id)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;