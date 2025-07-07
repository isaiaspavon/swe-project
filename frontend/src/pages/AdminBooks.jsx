import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const initialBooks = [
  { id: 'book1', title: 'Clean Code', author: 'Robert C. Martin', price: 24.99 },
  { id: 'book2', title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', price: 35.00 }
];

const AdminBooks = () => {
  const [books, setBooks] = useState(initialBooks);
  const [form, setForm] = useState({ title: '', author: '', price: '' });
  const [editingId, setEditingId] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    if (!form.title || !form.author || !form.price) return;
    setBooks([...books, { id: `book${Date.now()}`, ...form, price: parseFloat(form.price) }]);
    setForm({ title: '', author: '', price: '' });
  };

  const handleEdit = book => {
    setEditingId(book.id);
    setForm({ title: book.title, author: book.author, price: book.price });
  };

  const handleUpdate = e => {
    e.preventDefault();
    setBooks(books.map(b => b.id === editingId ? { ...b, ...form, price: parseFloat(form.price) } : b));
    setEditingId(null);
    setForm({ title: '', author: '', price: '' });
  };

  const handleDelete = id => setBooks(books.filter(b => b.id !== id));

  return (
    <div style={{ padding: '2rem' }}>
      <Link to="/admin" style={{ color: '#facc15', textDecoration: 'underline' }}>← Back to Dashboard</Link>
      <h2>Manage Books</h2>
      <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ marginBottom: '1.5rem' }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required style={{ marginRight: 8 }} />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required style={{ marginRight: 8 }} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required style={{ marginRight: 8, width: 80 }} />
        <button type="submit" style={{ background: '#2e7d32', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1rem' }}>
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', author: '', price: '' }); }} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </form>
      <table style={{ width: '100%', background: '#232323', color: '#f4f4f5', borderRadius: 8 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Title</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Author</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Price</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td style={{ padding: 8 }}>{book.title}</td>
              <td style={{ padding: 8 }}>{book.author}</td>
              <td style={{ padding: 8 }}>${book.price.toFixed(2)}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleEdit(book)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(book.id)} style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBooks;