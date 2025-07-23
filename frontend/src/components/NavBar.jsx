import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SignInModal from './SignInModal';
import CreateAccountModal from './CreateAccountModal';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import './NavBar.css';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'genre', label: 'Genre' }
];

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { getCartCount } = useCart();
  const { currentUser, userProfile, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync dropdown with URL param on load or URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlFilter = params.get('filter') || 'all';
    setSearchFilter(urlFilter);
    setSearchQuery(params.get('q') || '');
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Only update local state when filter changes
  const handleFilterChange = (value) => {
    setSearchFilter(value);
  };

  // Only update URL when user clicks Search or presses Enter
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      params.set('filter', searchFilter);
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        background: 'linear-gradient(#1e1e1e, #414040ff)',
        color: 'white',
        zIndex: 1000
      }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            height: '60px',
          }}
        >
          <img
            src={logo}
            alt="The Gilded Page Logo"
            style={{
              height: '85px',
              marginRight: '0.25rem',
              marginTop: '2.5px',
              display: 'block',
            }}
          />
          <span
            style={{
              fontWeight: 'bold',
              fontSize: '1.3rem',
              backgroundImage: 'linear-gradient(90deg, #a58a29ff, #ece6b2ff, #e6c564ff, #f1cd3dff, #ede9e9ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              textShadow: '0 0 5px rgba(245, 228, 145, 0.1), 0 0 5px rgba(238, 231, 35, 0.1)',
              backgroundSize: '200%',
              animation: 'none',
            }}
          >
            The Gilded Page
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select 
            value={searchFilter}
            onChange={e => handleFilterChange(e.target.value)}
            style={{ 
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRight: 'none',
              borderRadius: '6px 0 0 6px',
              background: 'linear-gradient(#b5a8eeff, #61adecff)',
              fontSize: '14px',
              height: '38px',
              outline: 'none',
              appearance: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: 'black',
              textAlign: 'center'
            }}
          >
            {FILTER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder={`Search by ${searchFilter === 'all' ? 'title, author, or genre' : searchFilter}...`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              background: 'white',
              color: 'black',
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderLeft: 'none',
              borderRight: 'none',
              width: '350px',
              height: '20px',
              fontSize: '14px',
              borderRadius: '0',
              outline: 'none',
            }}
          />

          <button
            onClick={handleSearch}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(#61adecff, #b5a8eeff)',
              border: '1px solid #ccc',
              borderLeft: 'none',
              borderRadius: '0 6px 6px 0',
              height: '38px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              color: 'black'
            }}
          >
            Search
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#b5a8eeff'
              }} />
              <span>{isAuthenticated ? (userProfile?.name || 'My Account') : 'My Account'} ▾</span>
            </div>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                backgroundColor: 'white',
                color: 'black',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                width: '220px',
                zIndex: 1100
              }}>
                {!isAuthenticated ? (
                  <div style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    <button
                      onClick={() => {
                        setShowSignIn(true);
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#b5a8eeff',
                        color: '#000',
                        border: 'none',
                        borderRadius: '4px',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}>
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateAccount(true);
                        setDropdownOpen(false);
                      }}
                      style={{
                        color: '#232323ff',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        background: 'none',
                        marginLeft: '20px',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        font: 'inherit',
                        fontWeight: 'bold',
                        textShadow: `-1px -1px 0 #b5a8ee67,
                                     1px -1px 0 #b5a8ee67,
                                    -1px  1px 0 #b5a8ee67,
                                     1px  1px 0 #b5a8ee67 `,
                      }}
                    >
                      Create an Account
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                      Welcome, {userProfile?.name || currentUser.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#af1818ff',
                        border: "2px, outset, #c4463dff",
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                      Sign Out
                    </button>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #ddd' }}>
                  {isAuthenticated && isAdmin && (
                    <DropdownLink 
                      to="/admin" 
                      closeDropdown={() => setDropdownOpen(false)}
                      requireAuth={true}
                    >
                      Admin Dashboard
                    </DropdownLink>
                  )}
                  <DropdownLink 
                    to="/account?section=account" 
                    closeDropdown={() => setDropdownOpen(false)}
                    requireAuth={true}
                  >
                    Manage Account
                  </DropdownLink>
                  <DropdownLink 
                    to="/account?section=orders" 
                    closeDropdown={() => setDropdownOpen(false)}
                    requireAuth={true}
                  >
                    Order History
                  </DropdownLink>
                  <DropdownLink 
                    to="/account?section=settings" 
                    closeDropdown={() => setDropdownOpen(false)}
                    requireAuth={true}
                  >
                    Account Settings
                  </DropdownLink>
                  <DropdownLink 
                    to="/account?section=payments" 
                    closeDropdown={() => setDropdownOpen(false)}
                    requireAuth={true}
                  >
                    Payment Methods
                  </DropdownLink>
                  <DropdownLink 
                    to="/account?section=address" 
                    closeDropdown={() => setDropdownOpen(false)}
                    requireAuth={true}
                  >
                    Address Book
                  </DropdownLink>
                  <DropdownLink 
                    to="/account?section=email" 
                    closeDropdown={() => setDropdownOpen(false)}
                    requireAuth={true}
                  >
                    Promotions
                  </DropdownLink>
                </div>
              </div>
            )}
          </div>
          <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              fontSize: '1.3rem', 
              marginRight: '0.3rem',
              display: 'inline-block',
              width: '1.3rem',
              height: '1.3rem',
              background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'%3E%3Cpath d=\'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z\'/%3E%3C/svg%3E") no-repeat center',
              backgroundSize: 'contain'
            }} />
            Cart
            <span style={{
              marginLeft: '0.4rem',
              backgroundColor: '#af1818ff',
              color: 'white',
              borderRadius: '50%',
              minWidth: '24px', // enough for two digits
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              position: 'relative',
              top: '-6px',
              opacity: getCartCount() > 0 ? 1 : 0,
              transition: 'opacity 0.2s'
            }}>
              {getCartCount() > 0 ? getCartCount() : '\u00A0\u00A0'}
            </span>
          </Link>
        </div>
      </nav>
      <SignInModal 
        isOpen={showSignIn} 
        onClose={() => setShowSignIn(false)}
        onSwitchToCreateAccount={() => {
          setShowSignIn(false);
          setShowCreateAccount(true);
        }}
      />
      <CreateAccountModal 
        isOpen={showCreateAccount} 
        onClose={() => setShowCreateAccount(false)}
        onSwitchToSignIn={() => {
          setShowCreateAccount(false);
          setShowSignIn(true);
        }}
      />
    </>
  );
};

const DropdownLink = ({ to, children, closeDropdown, requireAuth }) => {
  const { isAuthenticated } = useAuth();
  
  if (requireAuth && !isAuthenticated) {
    return (
      <div
        style={{
          display: 'block',
          padding: '0.75rem 1rem',
          textDecoration: 'none',
          color: '#999',
          fontSize: '0.9rem',
          cursor: 'not-allowed'
        }}
      >
        {children} (Sign in required)
      </div>
    );
  }

  return (
    <Link
      to={to}
      style={{
        display: 'block',
        padding: '0.75rem 1rem',
        textDecoration: 'none',
        color: '#333',
        fontSize: '0.9rem'
      }}
      onClick={() => {
        window.scrollTo(0, 0);
        if (closeDropdown) closeDropdown();
      }}
    >
      {children}
    </Link>
  );
};

export default Navbar;