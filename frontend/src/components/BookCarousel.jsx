import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BookCard from "./BookCard";
import "./BookCarousel.css"; // we'll style it separately

const PRELOAD_AHEAD = 5;

const BookCarousel = ({ books }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleBooks = books.slice(startIndex, startIndex + 5);

  // Preload images for the next 5 books
  useEffect(() => {
    // Preload next 5 images
    const preloadNextStart = startIndex + 5;
    const preloadNextEnd = preloadNextStart + PRELOAD_AHEAD;
    books.slice(preloadNextStart, preloadNextEnd).forEach(book => {
      if (book.image) {
        const img = new window.Image();
        img.src = book.image;
      }
    });

    // Preload previous 5 images
    const preloadPrevStart = Math.max(0, startIndex - PRELOAD_AHEAD);
    const preloadPrevEnd = startIndex;
    books.slice(preloadPrevStart, preloadPrevEnd).forEach(book => {
      if (book.image) {
        const img = new window.Image();
        img.src = book.image;
      }
    });
  }, [startIndex, books]);

  const handleNext = () => {
    if (startIndex + 5 < books.length) {
      setStartIndex(startIndex + 5);
    }
  };

  const handlePrev = () => {
    if (startIndex - 5 >= 0) {
      setStartIndex(startIndex - 5);
    }
  };

  return (
    <div className="carousel-container">
      <button className="nav-button" onClick={handlePrev} disabled={startIndex === 0}>
        ◀
      </button>

      <div className="carousel-track">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={startIndex}
            className="carousel-slide"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {visibleBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <button className="nav-button" onClick={handleNext} disabled={startIndex + 5 >= books.length}>
        ▶
      </button>
    </div>
  );
};

export default BookCarousel;