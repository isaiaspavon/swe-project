import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from '../firebaseConfig';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    isbn: '', category: '', authors: '', title: '',
    image: '', edition: '', publisher: '', year: '', quantity: '',
    threshold: '', buyingPrice: '', sellingPrice: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const booksRef = ref(db, 'books');
    const unsubscribe = onValue(booksRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const booksList = Object.entries(data).map(([id, book]) => ({ id, ...book }));
        setBooks(booksList);
      } else {
        setBooks([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching books:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.authors || !form.isbn) return;

    try {
      const booksRef = ref(db, 'books');
      await push(booksRef, {
        ...form,
        quantity: parseInt(form.quantity),
        threshold: parseInt(form.threshold),
        buyingPrice: parseFloat(form.buyingPrice),
        sellingPrice: parseFloat(form.sellingPrice),
        year: parseInt(form.year)
      });
      resetForm();
    } catch (error) {
      alert('Failed to add book: ' + error.message);
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setForm({
      isbn: book.isbn || '', category: book.category || 'top-seller',
      authors: book.authors || '', title: book.title || '',
      image: book.image || '', edition: book.edition || '',
      publisher: book.publisher || '', year: book.year || '',
      quantity: book.quantity || '', threshold: book.threshold || '',
      buyingPrice: book.buyingPrice || '', sellingPrice: book.sellingPrice || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const bookRef = ref(db, `books/${editingId}`);
      await update(bookRef, {
        ...form,
        quantity: parseInt(form.quantity),
        threshold: parseInt(form.threshold),
        buyingPrice: parseFloat(form.buyingPrice),
        sellingPrice: parseFloat(form.sellingPrice),
        year: parseInt(form.year)
      });
      setEditingId(null);
      resetForm();
    } catch (error) {
      alert('Failed to update book: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await remove(ref(db, `books/${id}`));
      } catch (error) {
        alert('Failed to delete book: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setForm({
      isbn: '', category: '', authors: '', title: '',
      image: '', edition: '', publisher: '', year: '', quantity: '',
      threshold: '', buyingPrice: '', sellingPrice: ''
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Loading books...</h2></div>;
  }

  return (
    <div style={{ padding: '2rem', background: 'transparent', color: '#f4f4f5', minHeight: '100vh' }}>
      <Link to="/admin" style={{ color: '#bbdef4ff', textDecoration: 'underline' }}>← Back to Dashboard</Link>
      <h2 style={{ color: '#f6f084ff' }}>Manage Books</h2>

      <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ marginBottom: '1.5rem', background: '#232323', padding: '1rem', borderRadius: '8px', border: '0.2px solid #59595aff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'isbn', placeholder: 'ISBN' },
            { name: 'category', placeholder: 'Category' },
            { name: 'authors', placeholder: 'Authors' },
            { name: 'title', placeholder: 'Title' },
            { name: 'edition', placeholder: 'Edition' },
            { name: 'publisher', placeholder: 'Publisher' },
            { name: 'year', placeholder: 'Year', type: 'number' },
            { name: 'quantity', placeholder: 'In Stock', type: 'number' },
            { name: 'threshold', placeholder: 'Min Threshold', type: 'number' },
            { name: 'buyingPrice', placeholder: 'Buying Price', type: 'number' },
            { name: 'sellingPrice', placeholder: 'Selling Price', type: 'number' },
            { name: 'image', placeholder: 'Image URL' }
          ].map(({ name, placeholder, type = 'text' }) => (
            <input
              key={name}
              name={name}
              type={type}
              placeholder={placeholder}
              value={form[name]}
              onChange={handleChange}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444' }}
            />
          ))}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button type="submit" style={{ background: 'linear-gradient(#a8d6f5ff, #82c7f5ff)', color: 'black', border: 'none', borderRadius: 4, padding: '0.5rem 1rem' }}>
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} style={{ marginLeft: 8, background: '#666', color: 'white', border: 'none', borderRadius: 4, padding: '0.5rem 1rem' }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <table style={{ width: '100%', background: '#232323', color: '#f4f4f5', borderRadius: '8px', border: '0.2px solid #59595aff' }}>
        <thead>
          <tr>
            <th style={{ padding: 8 }}>Title</th>
            <th style={{ padding: 8 }}>Authors</th>
            <th style={{ padding: 8 }}>ISBN</th>
            <th style={{ padding: 8 }}>Stock</th>
            <th style={{ padding: 8 }}>Sell Price</th>
            <th style={{ padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td style={{ padding: 8 }}>{book.title}</td>
              <td style={{ padding: 8 }}>{book.authors}</td>
              <td style={{ padding: 8 }}>{book.isbn}</td>
              <td style={{ padding: 8 }}>{book.quantity}</td>
              <td style={{ padding: 8 }}>${parseFloat(book.sellingPrice || 0).toFixed(2)}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleEdit(book)} style={{ marginRight: 8, background: 'gray', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem' }}>Edit</button>
                <button onClick={() => handleDelete(book.id)} style={{ background: 'darkred', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {books.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
          No books found. Add your first book above!
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
