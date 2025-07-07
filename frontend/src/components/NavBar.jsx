import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import SignInModal from './SignInModal';
import CreateAccountModal from './CreateAccountModal';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const { getCartCount } = useCart();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        backgroundColor: '#1e1e1e',
        color: 'white',
        zIndex: 1000
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
          The Gilded Page
        </Link>
        
        <Link
          to="/admin"
          style={{
            backgroundColor: 'rgb(250, 204, 21)',
            color: 'white',
            borderRadius: '4px',
            padding: '0.3rem 1.2rem',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Admin View
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select 
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{ 
              padding: '0.5rem', 
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              color: 'black'
            }}
          >
            <option value="title">Search by Title</option>
            <option value="author">Search by Author</option>
            <option value="genre">Search by Genre</option>
          </select>
          
          <input
            type="text"
            placeholder={`Search by ${searchFilter}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.5rem',
              width: '400px',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
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
                backgroundColor: '#888'
              }} />
              <span>My Account ▾</span>
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
                zIndex: 999
              }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                  <button
                    onClick={() => {
                      setShowSignIn(true);
                      setDropdownOpen(false);
                    }}
                      style={{
                      width: '100%',
                      padding: '0.5rem',
                      backgroundColor: '#2e7d32',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      marginBottom: '0.5rem',
                      cursor: 'pointer'
                    }}>
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateAccount(true);
                      setDropdownOpen(false);
                    }}
                    style={{
                      color: '#2e7d32',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0',
                      font: 'inherit'
                    }}
                  >
                    Create an Account
                  </button>
                </div>
                <div style={{ borderTop: '1px solid #ddd' }}>
                  <DropdownLink to="/account?section=account" closeDropdown={() => setDropdownOpen(false)}>Manage Account</DropdownLink>
                  <DropdownLink to="/account?section=orders" closeDropdown={() => setDropdownOpen(false)}>Order History</DropdownLink>
                  <DropdownLink to="/account?section=settings" closeDropdown={() => setDropdownOpen(false)}>Account Settings</DropdownLink>
                  <DropdownLink to="/account?section=payments" closeDropdown={() => setDropdownOpen(false)}>Payment Methods</DropdownLink>
                  <DropdownLink to="/account?section=address" closeDropdown={() => setDropdownOpen(false)}>Address Book</DropdownLink>
                  <DropdownLink to="/account?section=email" closeDropdown={() => setDropdownOpen(false)}>Email Preferences</DropdownLink>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" style={{ color: 'white', textDecoration: 'none', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span role="img" aria-label="cart" style={{ fontSize: '1.3rem', marginRight: '0.3rem' }}>🛒</span>
            Cart
            {getCartCount() > 0 && (
              <span style={{
                marginLeft: '0.4rem',
                backgroundColor: '#f44336',
                color: 'white',
                borderRadius: '50%',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                position: 'relative',
                top: '-6px'
              }}>
                {getCartCount()}
              </span>
            )}
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

// Helper Component for links
const DropdownLink = ({ to, children, closeDropdown }) => (
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

export default Navbar;