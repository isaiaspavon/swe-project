import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchBooks } from "../firebaseConfig";
import BookCarousel from "../components/BookCarousel";
import "./HomePage.css";

const HomePage = ({ searchQuery, searchFilter }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks((loadedBooks) => {
      setBooks(loadedBooks);
    });
  }, []);

  const filteredBooks = books.filter((book) => {
    if (!searchQuery) return true;
    const value = searchQuery.toLowerCase();
    if (searchFilter === "title") return book.title.toLowerCase().includes(value);
    if (searchFilter === "author") return book.author.toLowerCase().includes(value);
    if (searchFilter === "genre") return (book.category || "").toLowerCase().includes(value);
    return true;
  });

  const topSellers = filteredBooks.filter((book) => book.category === "top-seller");
  const comingSoon = filteredBooks.filter((book) => book.category === "coming-soon");

  return (
    <motion.div
      className="homepage"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
      style={{ marginTop: '1.5rem' }}
    >
      <h2>Best Sellers</h2>
      <BookCarousel books={topSellers} />

      <h2>Coming Soon</h2>
      <BookCarousel books={comingSoon} />
    </motion.div>
  );
};

export default HomePage;