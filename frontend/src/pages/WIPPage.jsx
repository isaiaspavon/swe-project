import React, { useState, useEffect } from 'react';
import WIPImage from '../assets/WipCat.PNG.png';
import './WIPPage.css';

const WIPPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 0.5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Apple-level font stack
  const appleFont = '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", "Roboto", "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif';

  return (
    <div 
      className={`wip-container ${isVisible ? 'visible' : ''}`}
      style={{ fontFamily: appleFont }}
    >
      {/* Construction Background Elements */}
      <div className="construction-bg">
        <div className="construction-grid"></div>
        <div className="floating-tools">
          <div className="tool tool-1">🔨</div>
          <div className="tool tool-2">⚡</div>
          <div className="tool tool-3">🔧</div>
          <div className="tool tool-4">📐</div>
          <div className="tool tool-5">🎨</div>
        </div>
        <div className="construction-lines">
          <div className="line line-1"></div>
          <div className="line line-2"></div>
          <div className="line line-3"></div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="wip-content"
        style={{ fontFamily: appleFont }}
      >
        {/* WIP Cat Icon */}
        <div className="construction-icon">
          <div className="icon-container">
            <img src={WIPImage} alt="Work in Progress Cat" className="wip-cat" />
            <div className="sparkles">
              <span>✨</span>
              <span>✨</span>
              <span>✨</span>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="wip-header">
          <h1 
            className="wip-title"
            style={{ fontFamily: appleFont }}
          >
            <span className="title-text">Under Construction</span>
            <div className="title-decoration">
              <span className="decoration-dot">•</span>
              <span className="decoration-dot">•</span>
              <span className="decoration-dot">•</span>
            </div>
          </h1>
          <p 
            className="wip-subtitle"
            style={{ fontFamily: appleFont }}
          >
            Our team of expert builders is working hard to create something amazing for you
          </p>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-info">
            <span 
              className="progress-label"
              style={{ fontFamily: appleFont }}
            >
              Construction Progress
            </span>
            <span 
              className="progress-percentage"
              style={{ fontFamily: appleFont }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="progress-indicators">
              <div className="indicator active">📋</div>
              <div className={`indicator ${progress > 20 ? 'active' : ''}`}>🔨</div>
              <div className={`indicator ${progress > 40 ? 'active' : ''}`}>⚡</div>
              <div className={`indicator ${progress > 60 ? 'active' : ''}`}>🎨</div>
              <div className={`indicator ${progress > 80 ? 'active' : ''}`}>✨</div>
            </div>
          </div>
        </div>

        {/* Cute Message Section */}
        <div 
          className="cute-message-section"
          style={{ fontFamily: appleFont }}
        >
          <div className="cute-message-card">
            <div className="cute-icon">🐱</div>
            <div className="cute-content">
              <h3 
                className="cute-title"
                style={{ fontFamily: appleFont }}
              >
                Purr-fect things take time!
              </h3>
              <p 
                className="cute-description"
                style={{ fontFamily: appleFont }}
              >
                Our construction cat is making sure everything is just right. 
                Good things come to those who wait! 🎯
              </p>
            </div>
          </div>
          
          <div className="cute-stats">
            <div className="cute-stat">
              <span className="cute-stat-icon">😴</span>
              <span 
                className="cute-stat-text"
                style={{ fontFamily: appleFont }}
              >
                Taking cat naps
              </span>
            </div>
            <div className="cute-stat">
              <span className="cute-stat-icon">🎵</span>
              <span 
                className="cute-stat-text"
                style={{ fontFamily: appleFont }}
              >
                Listening to purr-fect tunes
              </span>
            </div>
            <div className="cute-stat">
              <span className="cute-stat-icon">🌟</span>
              <span 
                className="cute-stat-text"
                style={{ fontFamily: appleFont }}
              >
                Making it purr-fect
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WIPPage;