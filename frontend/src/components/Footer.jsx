import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="gilded-footer">
    <div className="footer-content">
      <div className="footer-brand">
        <span role="img" aria-label="book" style={{ marginRight: 8 }}>📚</span>
        <span className="footer-title">The Gilded Page</span>
      </div>
      <div className="footer-links">
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">FAQ</a>
        <a href="#">Careers</a>
        <a href="#">Instagram</a>
      </div>
      <div className="footer-newsletter">
        <input type="email" placeholder="Subscribe to newsletter" />
        <button>Subscribe</button>
      </div>
    </div>
    <div className="footer-bottom">
      © {new Date().getFullYear()} The Gilded Page. All rights reserved.
    </div>
  </footer>
);

export default Footer;