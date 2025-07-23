import React from 'react';
import WIPImage from '../assets/IMG_8846.png';

const WIPPage = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    textAlign: 'center',
    background: 'none',
  }}>
    <img src={WIPImage} alt="Work in Progress" style={{ maxWidth: 320, width: '100%', marginBottom: 24 }} />
    <h2 style={{ color: '#2e7d32', fontWeight: 700, fontSize: '2rem' }}>Work In Progress</h2>
    <p style={{ color: '#555', fontSize: '1.1rem' }}>This page is under construction. Please check back soon!</p>
  </div>
);

export default WIPPage; 