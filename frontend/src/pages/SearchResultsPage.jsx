import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';
import BookCard from '../components/BookCard';
import './SearchResultsPage.css';

const accent = "#317ab5ff";
const darkBg = "#18181b";
const cardBg = "#232323";
const border = "#333";
const text = "#f4f4f5";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get filter params from URL
  const query = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || 'all';
  const category = searchParams.get('subject') || 'all';
  const genre = searchParams.get('genre') || 'all';
  const priceRange = searchParams.get('price') || 'all';

  // Single source of truth for all filters
  const [localFilter, setLocalFilter] = useState(filter);
  const [localCategory, setLocalCategory] = useState(category);
  const [localGenre, setLocalGenre] = useState(genre);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  // Keep local state in sync with URL params (for direct URL changes)
  useEffect(() => {
    setLocalFilter(filter);
    setLocalCategory(category);
    setLocalGenre(genre);
    setLocalPriceRange(priceRange);
  }, [filter, category, genre, priceRange]);

  useEffect(() => {
    const booksRef = ref(db, 'books');
    const unsubscribe = onValue(booksRef, (snapshot) => {
      if (snapshot.exists()) {
        const booksData = snapshot.val();
        const booksList = Object.entries(booksData).map(([id, book]) => ({
          id,
          ...book,
        }));
        setBooks(booksList);
      } else {
        setBooks([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!books.length) return;
    let results = books;
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(book => {
        switch (localFilter) {
          case 'title':
            return String(book.title || '').toLowerCase().includes(searchTerm);
          case 'author':
            return String(book.author || '').toLowerCase().includes(searchTerm);
          case 'isbn':
            return String(book.isbn || '').includes(query);
          case 'category':
            return String(book.category || '').toLowerCase().includes(searchTerm);
          default:
            return (
              String(book.title || '').toLowerCase().includes(searchTerm) ||
              String(book.author || '').toLowerCase().includes(searchTerm) ||
              String(book.isbn || '').includes(query) ||
              String(book.category || '').toLowerCase().includes(searchTerm)
            );
        }
      });
    }
    if (localCategory !== 'all') {
      results = results.filter(book => book.category === localCategory);
    }
    if (localGenre !== 'all') {
      results = results.filter(book => book.genre === localGenre);
    }
    if (localPriceRange !== 'all') {
      const [min, max] = localPriceRange.split('-').map(Number);
      results = results.filter(book => {
        const price = parseFloat(book.price) || 0;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }
    setFilteredBooks(results);
  }, [books, query, localFilter, localCategory, localGenre, localPriceRange]);

  const getUniqueGenres = () => {
    const genres = books.map(book => book.genre).filter(Boolean);
    return [...new Set(genres)];
  };

  // Update both local state and URL params
  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    navigate(`/search?${params.toString()}`);
  };

  // Unified handler for all filter changes
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'filter':
        setLocalFilter(value);
        updateFilters({ filter: value });
        break;
      case 'category':
        setLocalCategory(value);
        updateFilters({ category: value });
        break;
      case 'genre':
        setLocalGenre(value);
        updateFilters({ genre: value });
        break;
      case 'price':
        setLocalPriceRange(value);
        updateFilters({ price: value });
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="elite-search-bg">
        <div className="elite-loader">Searching books...</div>
      </div>
    );
  }

  return (
    <div className="elite-search-bg">
      <div className="elite-search-header">
        <h1>Search Results</h1>
        {/* Top filter bar */}
        <div style={{ margin: '1.5rem 0', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ color: '#f4f4f5', fontWeight: 600, marginRight: 8 }}>Search Type:</label>
          {['all','title', 'author', 'ISBN', 'subject'].map(opt => (
            <button
              key={opt}
              className={`elite-pill${localFilter === opt ? ' active' : ''}`}
              onClick={() => handleFilterChange('filter', opt)}
              style={{ minWidth: 80 }}
            >
              {opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
        {query && (
          <p>
            <span className="elite-accent">"{query}"</span> — {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>
      <div className="elite-search-content">
        {/* Sidebar */}
        <aside className="elite-sidebar">
          <h3>Filters</h3>
          <div className="elite-filter-group">
            <label>Search Type</label>
            <div className="elite-pill-group">
              {['all', 'title', 'author', 'ISBN', 'subject'].map(opt => (
                <button
                  key={opt}
                  className={`elite-pill${localFilter === opt ? ' active' : ''}`}
                  onClick={() => handleFilterChange('filter', opt)}
                >
                  {opt === 'all' ? 'All' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="elite-filter-group">
            <label>Subject</label>
            <select
              value={localCategory}
              onChange={e => handleFilterChange('category', e.target.value)}
              className="elite-select"
            >
              <option value="all">All Subjects</option>
              {['education', 'fantasy', 'history', 'horror', 'mystery',
                'non-fiction', 'romance', 'science-fiction', 'thriller'].map(opt => (
                <option key={opt} value={opt}>
                  {opt.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
            ))}
            </select>
          </div>
          
          <div className="elite-filter-group">
            <label>Price</label>
            <select
              value={localPriceRange}
              onChange={e => handleFilterChange('price', e.target.value)}
              className="elite-select"
            >
              <option value="all">All Prices</option>
              <option value="0-10">Under $10</option>
              <option value="10-20">$10 - $20</option>
              <option value="20-30">$20 - $30</option>
              <option value="30-50">$30 - $50</option>
              <option value="50-">$50+</option>
            </select>
          </div>
          <button
            className="elite-clear-btn"
            onClick={() => {
              setLocalFilter('all');
              setLocalCategory('all');
              setLocalGenre('all');
              setLocalPriceRange('all');
              navigate('/search');
            }}
          >
            Clear All Filters
          </button>
        </aside>
        {/* Results */}
        <main className="elite-results">
          {filteredBooks.length === 0 ? (
            <div className="elite-no-results">
              <h3>No books found</h3>
              <p>Try adjusting your search or filters.</p>
              <button
                className="elite-accent-btn"
                onClick={() => navigate('/')}
              >
                Browse All Books
              </button>
            </div>
          ) : (
            <div className="elite-books-grid">
              {filteredBooks.map(book => (
                <div className="elite-book-card" key={book.id}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResultsPage;