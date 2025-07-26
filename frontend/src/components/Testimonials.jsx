import React, { useState, useEffect } from "react";
import "./Testimonials.css";

const testimonials = [
  {
    name: "Sydney Swaggs",
    quote: "Absolutely love the selection and the vibe! My new favorite bookstore. Always have my favorite smut in stock!!!",
    avatar: "🦄",
    category: "Book Enthusiast"
  },
  {
    name: "Nikki Maserati",
    quote: "The Gilded Page makes book shopping feel magical. Fast shipping too!",
    avatar: "🚗",
    category: "Avid Reader"
  },
  {
    name: "Naveen Undr-Wahter",
    quote: "I found rare titles I couldn't get anywhere else. Highly recommend!",
    avatar: "🌊",
    category: "Collector"
  },
  {
    name: "Kahan Patraveling",
    quote: "Great deals, beautiful site, and a fantastic community of readers.",
    avatar: "🌍",
    category: "Traveling Reader"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.testimonials-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleTransition();
    }, 4000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [currentIndex]);

  const handleTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handleDotClick = (idx) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <section className={`testimonials-section ${isVisible ? 'visible' : ''}`}>
      <div className="testimonials-wrapper">
        {/* Header */}
        <div className="testimonials-header">
          <h2 className="testimonials-title">What Readers Are Saying</h2>
          <p className="testimonials-subtitle">
            Join thousands of satisfied customers who've discovered their next favorite book
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="testimonial-display">
          <div className={`testimonial-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
            <div className="quote-mark">"</div>
            <blockquote className="testimonial-quote">
              {testimonials[currentIndex].quote}
            </blockquote>
            <div className="testimonial-author">
              <div className="author-info">
                <div className="author-avatar">
                  {testimonials[currentIndex].avatar}
                </div>
                <div className="author-details">
                  <h4 className="author-name">{testimonials[currentIndex].name}</h4>
                  <p className="author-category">{testimonials[currentIndex].category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="testimonial-nav-dots">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`testimonial-dot${idx === currentIndex ? " active" : ""}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Show testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;