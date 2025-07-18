import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { db } from '../firebaseConfig';

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', price: '', category: 'top-seller' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch books from Firebase
  useEffect(() => {
    const booksRef = ref(db, 'books');
    console.log('🔍 Fetching books from Firebase...');
    
    const unsubscribe = onValue(booksRef, (snapshot) => {
      console.log('📚 Books snapshot:', snapshot.val());
      if (snapshot.exists()) {
        const booksData = snapshot.val();
        const booksList = Object.entries(booksData).map(([id, book]) => ({
          id,
          ...book,
        }));
        console.log('�� Processed books:', booksList);
        setBooks(booksList);
      } else {
        console.log('❌ No books found in database');
        setBooks([]);
      }
      setLoading(false);
    }, (error) => {
      console.error('❌ Error fetching books:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.price) return;
    
    try {
      console.log('➕ Adding book:', form);
      const booksRef = ref(db, 'books');
      const newBookRef = await push(booksRef, {
        title: form.title,
        author: form.author,
        price: parseFloat(form.price),
        category: form.category,
        image: form.image || '/path/to/default-image.jpg'
      });
      
      console.log('✅ Book added successfully with ID:', newBookRef.key);
      setForm({ title: '', author: '', price: '', category: 'top-seller', image: '' });
    } catch (error) {
      console.error('❌ Error adding book:', error);
      alert('Failed to add book: ' + error.message);
    }
  };

  const handleEdit = book => {
    console.log('✏️ Editing book:', book);
    setEditingId(book.id);
    setForm({ 
      title: book.title, 
      author: book.author, 
      price: book.price,
      category: book.category || 'top-seller',
      image: book.image || ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!editingId) {
      console.error('❌ No editing ID found');
      return;
    }
    
    try {
      console.log('�� Updating book with ID:', editingId, 'Data:', form);
      const bookRef = ref(db, `books/${editingId}`);
      await update(bookRef, {
        title: form.title,
        author: form.author,
        price: parseFloat(form.price),
        category: form.category,
        image: form.image || '/path/to/default-image.jpg'
      });
      
      console.log('✅ Book updated successfully');
      setEditingId(null);
      setForm({ title: '', author: '', price: '', category: 'top-seller', image: '' });
    } catch (error) {
      console.error('❌ Error updating book:', error);
      alert('Failed to update book: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error('❌ No book ID provided for deletion');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        console.log('🗑️ Deleting book with ID:', id);
        const bookRef = ref(db, `books/${id}`);
        await remove(bookRef);
        console.log('✅ Book deleted successfully');
      } catch (error) {
        console.error('❌ Error deleting book:', error);
        alert('Failed to delete book: ' + error.message);
      }
    }
  };

  const handleCancelEdit = () => {
    console.log('❌ Canceling edit');
    setEditingId(null);
    setForm({ title: '', author: '', price: '', category: 'top-seller', image: '' });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading books...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', background: 'transparent', color: '#f4f4f5', minHeight: '100vh' }}>
      <Link to="/admin" style={{ color: '#bbdef4ff', textDecoration: 'underline' }}>← Back to Dashboard</Link>
      <h2 style={{ color: '#f6f084ff' }}>Manage Books</h2>
      
      {/* Debug Info */}
      <div style={{ background: '#333', padding: '1rem', marginBottom: '1rem', borderRadius: '4px', border: '0.2px solid #59595aff'}}>
        <p><strong>Debug Info:</strong></p>
        <p>Books loaded: {books.length}</p>
        <p>Currently editing: {editingId || 'None'}</p>
        <p>Form data: {JSON.stringify(form)}</p>
      </div>
      
      <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ marginBottom: '1.5rem', background: '#232323', padding: '1rem', borderRadius: '8px', border: '0.2px solid #59595aff' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center',  }}>
          <input 
            name="title" 
            placeholder="Title" 
            value={form.title} 
            onChange={handleChange} 
            required 
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444' }} 
          />
          <input 
            name="author" 
            placeholder="Author" 
            value={form.author} 
            onChange={handleChange} 
            required 
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444' }} 
          />
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            placeholder="Price" 
            value={form.price} 
            onChange={handleChange} 
            required 
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', width: '100px' }} 
          />
          <select 
            name="category" 
            value={form.category} 
            onChange={handleChange}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444' }}
          >
            <option value="top-seller">Top Seller</option>
            <option value="coming-soon">Coming Soon</option>
          </select>
          <input 
            name="image" 
            placeholder="Image URL (optional)" 
            value={form.image} 
            onChange={handleChange} 
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', width: '200px' }} 
          />
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
            <th style={{ textAlign: 'left', padding: 8 }}>Title</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Author</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Price</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Category</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td style={{ padding: 8 }}>{book.title}</td>
              <td style={{ padding: 8 }}>{book.author}</td>
              <td style={{ padding: 8 }}>${book.price?.toFixed(2) || '0.00'}</td>
              <td style={{ padding: 8 }}>{book.category || 'N/A'}</td>
              <td style={{ padding: 8 }}>
                <button 
                  onClick={() => handleEdit(book)} 
                  style={{ marginRight: 8, background: 'linear-gradient(#616060ff, #2b2b2bff)', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(book.id)} 
                  style={{ background: 'linear-gradient(#f1155eff, #940b24ff)', color: 'white', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem' }}
                >
                  Delete
                </button>
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