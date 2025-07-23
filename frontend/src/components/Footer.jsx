import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="gilded-footer">
    <div className="footer-content">
      <div className="footer-brand">
        <span role="img" aria-label="book" style={{ marginRight: 8 }}>📚</span>
        <span className="footer-title">The Gilded Page</span>
      </div>
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/wip">Contact</Link>
        <Link to="/wip">FAQ</Link>
        <Link to="/wip">Careers</Link>
        <Link to="/wip">Instagram</Link>
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