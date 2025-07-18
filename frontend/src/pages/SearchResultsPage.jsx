import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebaseConfig';
import BookCard from '../components/BookCard';
import './SearchResultsPage.css';

const accent = "#f5b5efff";
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

  const query = searchParams.get('q') || '';
  const filter = searchParams.get('filter') || 'title';
  const category = searchParams.get('category') || 'all';
  const genre = searchParams.get('genre') || 'all';
  const priceRange = searchParams.get('price') || 'all';

  const [localFilter, setLocalFilter] = useState(filter);
  const [localCategory, setLocalCategory] = useState(category);
  const [localGenre, setLocalGenre] = useState(genre);
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

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
            return book.title?.toLowerCase().includes(searchTerm);
          case 'author':
            return book.author?.toLowerCase().includes(searchTerm);
          case 'genre':
            return book.genre?.toLowerCase().includes(searchTerm);
          default:
            return (
              book.title?.toLowerCase().includes(searchTerm) ||
              book.author?.toLowerCase().includes(searchTerm) ||
              book.genre?.toLowerCase().includes(searchTerm)
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
              {['title', 'author', 'genre', 'all'].map(opt => (
                <button
                  key={opt}
                  className={`elite-pill${localFilter === opt ? ' active' : ''}`}
                  onClick={() => handleFilterChange('filter', opt)}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="elite-filter-group">
            <label>Category</label>
            <div className="elite-pill-group">
              {['all', 'top-seller', 'coming-soon'].map(opt => (
                <button
                  key={opt}
                  className={`elite-pill${localCategory === opt ? ' active' : ''}`}
                  onClick={() => handleFilterChange('category', opt)}
                >
                  {opt === 'all' ? 'All' : opt.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
          <div className="elite-filter-group">
            <label>Genre</label>
            <select
              value={localGenre}
              onChange={e => handleFilterChange('genre', e.target.value)}
              className="elite-select"
            >
              <option value="all">All Genres</option>
              {getUniqueGenres().map(genre => (
                <option key={genre} value={genre}>{genre}</option>
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
              setLocalFilter('title');
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