import React from 'react';

const filterOptions = [
  'All', 'Books', 'Audiobooks', 'eBooks & NOOK', 'Newsstand', 'Teens & YA', 'Kids',
  'Toys & Games', 'Stationery & Gifts', 'Movies & TV', 'Music', 'Book Annex'
];

const SearchBar = ({
  value,
  onChange,
  filter,
  onFilterChange,
  onSearch
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #ccc',
      borderRadius: '4px',
      background: '#888888',
      width: '800px',
      height: '44px',
      overflow: 'hidden'
    }}>
      {/* Dropdown */}
      <select
        value={filter}
        onChange={onFilterChange}
        style={{
          border: 'none',
          background: '#c8c8c8',
          color: '#222',
          padding: '0 0.5rem',
          height: '100%',
          fontSize: '1rem',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        {filterOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search by Title, Author, Keyword or ISBN"
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          padding: '0 1rem',
          fontSize: '1rem',
          background: 'transparent',
          color: 'white',
          width: '800px'
        }}
      />

      {/* Search Icon Button */}
      <button
        style={{
          background: '#c8c8c8',
          border: 'none',
          color: '#c8c8c8',
          padding: '0 1rem',
          height: '100%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          outline: 'none',
          fontSize: '1.3rem',
          borderRadius: 0
        }}
        aria-label="Search"
        onClick={onSearch}
      >
        <span role="img" aria-label="search">🔍</span>
      </button>
    </div>
  );
};

export default SearchBar; 