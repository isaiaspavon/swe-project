import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialPromos = [
  { id: 'promo1', code: 'SAVE10', description: '10% off your order' },
  { id: 'promo2', code: 'FREESHIP', description: 'Free shipping on orders over $50' }
];

const AdminPromotions = () => {
  const [promos, setPromos] = useState(initialPromos);
  const [form, setForm] = useState({ code: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    if (!form.code || !form.description) return;
    setPromos([...promos, { id: `promo${Date.now()}`, ...form }]);
    setForm({ code: '', description: '' });
  };

  const handleEdit = promo => {
    setEditingId(promo.id);
    setForm({ code: promo.code, description: promo.description });
  };

  const handleUpdate = e => {
    e.preventDefault();
    setPromos(promos.map(p => p.id === editingId ? { ...p, ...form } : p));
    setEditingId(null);
    setForm({ code: '', description: '' });
  };

  const handleDelete = id => setPromos(promos.filter(p => p.id !== id));

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/admin" style={{ color: '#facc15', textDecoration: 'underline' }}>← Back to Dashboard</Link>
      <h2>Manage Promotions</h2>
      <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ marginBottom: '1.5rem' }}>
        <input name="code" placeholder="Promo Code" value={form.code} onChange={handleChange} required style={{ marginRight: 8 }} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ marginRight: 8 }} />
        <button type="submit" style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1rem' }}>
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ code: '', description: '' }); }} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </form>
      <table style={{ width: '100%', background: '#232323', color: '#f4f4f5', borderRadius: 8 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Code</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Description</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promos.map(promo => (
            <tr key={promo.id}>
              <td style={{ padding: 8 }}>{promo.code}</td>
              <td style={{ padding: 8 }}>{promo.description}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleEdit(promo)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(promo.id)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPromotions;