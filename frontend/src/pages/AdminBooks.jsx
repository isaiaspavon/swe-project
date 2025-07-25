import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from '../firebaseConfig';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    isbn: '', category: '', author: '', title: '',
    image: '', edition: '', publisher: '', year: '', inventory: '',
    threshold: '', buyingPrice: '', price: ''
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
    if (!form.title || !form.author || !form.isbn) return;

    try {
      const booksRef = ref(db, 'books');
      await push(booksRef, {
        ...form,
        inventory: parseInt(form.inventory),
        threshold: parseInt(form.threshold),
        buyingPrice: parseFloat(form.buyingPrice),
        price: parseFloat(form.price),
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
      author: book.author || '', title: book.title || '',
      image: book.image || '', edition: book.edition || '',
      publisher: book.publisher || '', year: book.year || '',
      inventory: book.inventory || '', threshold: book.threshold || '',
      buyingPrice: book.buyingPrice || '', price: book.price || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const bookRef = ref(db, `books/${editingId}`);
      await update(bookRef, {
        ...form,
        inventory: parseInt(form.inventory),
        threshold: parseInt(form.threshold),
        buyingPrice: parseFloat(form.buyingPrice),
        price: parseFloat(form.price),
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
      isbn: '', category: '', author: '', title: '',
      image: '', edition: '', publisher: '', year: '', inventory: '',
      threshold: '', buyingPrice: '', price: ''
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
      <h2 style={{ backgroundImage: 'linear-gradient(#b5a8eeff, #f6a0edff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    fontSize: '3.2 rem' }}>Manage Books</h2>

      <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ marginBottom: '1.5rem', background: '#232323', padding: '1rem', borderRadius: '8px', border: '0.2px solid #59595aff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'isbn', placeholder: 'ISBN', type: 'number'},
            { name: 'category', placeholder: 'Category' },
            { name: 'author', placeholder: 'Author' },
            { name: 'title', placeholder: 'Title' },
            { name: 'edition', placeholder: 'Edition' },
            { name: 'publisher', placeholder: 'Publisher' },
            { name: 'year', placeholder: 'Year', type: 'number' },
            { name: 'inventory', placeholder: 'In Stock', type: 'number' },
            { name: 'threshold', placeholder: 'Min Threshold', type: 'number' },
            { name: 'buyingPrice', placeholder: 'Buying Price', type: 'number' },
            { name: 'price', placeholder: 'Selling Price', type: 'number' },
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
            <th style={{ padding: 8 }}>Author</th>
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
              <td style={{ padding: 8 }}>{book.author}</td>
              <td style={{ padding: 8 }}>{book.isbn}</td>
              <td style={{ padding: 8 }}>{book.inventory}</td>
              <td style={{ padding: 8 }}>${parseFloat(book.price || 0).toFixed(2)}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleEdit(book)} style={{ marginRight: 8, background: 'gray', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem' }}>Edit</button>
                <button onClick={() => handleDelete(book.id)} style={{ backgroundColor: 'transparent',
  color: 'white',
  border: '1.5px solid #e22929ff',  borderRadius: 4, padding: '0.25rem 0.75rem' }}>Delete</button>
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
