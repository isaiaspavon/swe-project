// This is the Navigation Bar at the top of the Home Page, Manage Account Page, 

import React from "react";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
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
                XYZ Book Store
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

            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link to="/account" style={{ color: 'white', textDecoration: 'none' }}>
                    My Account
                </Link>

                <Link to="/checkout" style={{ color: 'white', textDecoration: 'none' }}>
                    Checkout
                </Link>
            </div>
    </nav>
  );


};

export default Navbar;

