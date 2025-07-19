import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="logo-container">
          <div className="logo-image">
            {/* Replace with your actual logo image path */}
            <img 
              src="/src/assets/GildedCat.png" 
              alt="The Gilded Page Logo" 
              className="gilded-logo"
            />
          </div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-blue">THE</span>
            <span className="text-gold"> GILDED</span>
            <span className="text-blue"> PAGE</span>
          </h1>
          <p className="hero-subtitle">
            Where wisdom meets strength, and every story becomes a treasure
          </p>
        </div>
      </div>

      <div className="about-content">
        <div className="content-section">
          <h2 className="section-title">
            <span className="text-gold">Our Story</span>
          </h2>
          <div className="story-grid">
            <div className="story-text">
              <p>
                Born from the vision of a panther's strength and an owl's wisdom, 
                The Gilded Page emerged as a sanctuary for those who seek knowledge 
                wrapped in beauty. Our feline guardian, with quill in hand and book 
                at heart, represents the perfect balance of power and intellect.
              </p>
              <p>
                Every book in our collection is carefully chosen, every page 
                meticulously curated. We believe that reading should be an 
                experience that transforms not just the mind, but the soul.
              </p>
            </div>
            <div className="story-stats">
              <div className="stat-item">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Books Curated</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50,000+</span>
                <span className="stat-label">Readers Served</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Authentic</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2 className="section-title">
            <span className="text-gold">Our Philosophy</span>
          </h2>
          <div className="philosophy-grid">
            <div className="philosophy-card">
              <div className="philosophy-icon">🦁</div>
              <h3>Strength</h3>
              <p>We stand strong in our commitment to quality, authenticity, and the power of knowledge.</p>
            </div>
            <div className="philosophy-card">
              <div className="philosophy-icon">🦉</div>
              <h3>Wisdom</h3>
              <p>Every book we offer is selected with the wisdom of centuries of literary tradition.</p>
            </div>
            <div className="philosophy-card">
              <div className="philosophy-icon">📚</div>
              <h3>Knowledge</h3>
              <p>We believe in the transformative power of reading and the endless possibilities it unlocks.</p>
            </div>
            <div className="philosophy-card">
              <div className="philosophy-icon">✨</div>
              <h3>Beauty</h3>
              <p>Every aspect of our service is crafted with the same care as the finest gilded manuscripts.</p>
            </div>
          </div>
        </div>

        <div className="content-section">
          <h2 className="section-title">
            <span className="text-gold">Our Promise</span>
          </h2>
          <div className="promise-content">
            <p className="promise-text">
              When you choose The Gilded Page, you're not just purchasing a book—you're 
              embarking on a journey. A journey guided by the strength of a panther and 
              the wisdom of an owl. Every page you turn, every story you discover, 
              becomes part of your own legend.
            </p>
            <div className="promise-signature">
              <span className="signature-line">— The Gilded Page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage;
