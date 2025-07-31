import React, { useEffect } from 'react';
import './AboutPage.css';

const AboutPage = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              We promise to deliver not just books, but experiences. Every order is handled with the care and attention that our readers deserve. From the moment you browse our collection to the instant your book arrives at your door, we ensure that every step of your journey with us is nothing short of exceptional.
            </p>
            <p className="promise-text">
              Join us in this adventure of discovery, where every page turned is a step toward wisdom, and every book chosen is a testament to the strength of human knowledge.
            </p>
          </div>
        </div>

        <div className="content-section">
          <h2 className="section-title">
            <span className="text-gold">Contact Us</span>
          </h2>
          <div className="contact-content">
            <p>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <strong>Email:</strong> info@thegildedpage.com
              </div>
              <div className="contact-item">
                <strong>Phone:</strong> (555) 123-4567
              </div>
              <div className="contact-item">
                <strong>Address:</strong> 123 Book Street, Literary City, LC 12345
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;