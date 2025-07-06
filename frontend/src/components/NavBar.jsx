import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import SignInModal from './SignInModal';

const Navbar = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

        <input
          type="text"
          placeholder="Search by Title, Author, Genre..."
          style={{
            padding: '0.5rem',
            width: '300px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {/* Placeholder Circle */}
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
                  <Link to="/create-account" style={{
                    color: '#2e7d32',
                    textDecoration: 'none',
                    fontSize: '0.9rem'
                  }}>
                    Create an Account
                  </Link>
                </div>
                <div style={{ borderTop: '1px solid #ddd' }}>
                  <DropdownLink to="/account">Manage Account</DropdownLink>
                  <DropdownLink to="/orders">Order Status</DropdownLink>
                  <DropdownLink to="/address-book">Address Book</DropdownLink>
                  <DropdownLink to="/payment-methods">Payment Methods</DropdownLink>
                  <DropdownLink to="/email-preferences">Email Preferences</DropdownLink>
                </div>
              </div>
            )}
          </div>

          <Link to="/checkout" style={{ color: 'white', textDecoration: 'none' }}>
            Checkout
          </Link>
        </div>
      </nav>
      <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  );
};

// Helper Component for links
const DropdownLink = ({ to, children }) => (
  <Link
    to={to}
    style={{
      display: 'block',
      padding: '0.75rem 1rem',
      textDecoration: 'none',
      color: '#333',
      fontSize: '0.9rem'
    }}
    onClick={() => window.scrollTo(0, 0)} // Optional: scroll to top on click
  >
    {children}
  </Link>
);

export default Navbar;
