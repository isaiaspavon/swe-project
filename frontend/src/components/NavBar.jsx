import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import SignInModal from './SignInModal';
import CreateAccountModal from './CreateAccountModal';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({
  searchQuery,
  setSearchQuery,
  searchFilter,
  setSearchFilter
}) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { getCartCount } = useCart();
  const { currentUser, userProfile, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await logout();
      setDropdownOpen(false);
      navigate('/'); // Redirect to homepage after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAccountAction = (action) => {
    if (!isAuthenticated) {
      setShowSignIn(true);
      setDropdownOpen(false);
      return;
    }
    
    // If authenticated, perform the action
    setDropdownOpen(false);
    // Navigation will be handled by the Link component
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
        background: 'linear-gradient(to bottom right, #1e1e1e, #2a2a2a)',
        color: 'white',
        zIndex: 1000
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#facc15', fontWeight: 'bold', fontSize: '1.2rem' }}>
          The Gilded Page
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
                backgroundColor: '#facc15'
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
                zIndex: 999
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
                        backgroundColor: '#facc15',
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
                        color: '#facc15',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        font: 'inherit',
                        fontWeight: 'bold'
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
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
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
                    Email Preferences
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