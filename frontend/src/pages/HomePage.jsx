import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchBooks } from "../firebaseConfig";
import BookCarousel from "../components/BookCarousel";
import "./HomePage.css";
import Footer from "../components/Footer";
import Testimonials from "../components/Testimonials";

const HomePage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks((loadedBooks) => {
      setBooks(loadedBooks);
    });
  }, []);

  // No filtering by searchQuery here!
  const topSellers = books.filter((book) => book.category === "top-seller");
  const comingSoon = books.filter((book) => book.category === "coming-soon");

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
      <Testimonials />
      <Footer />
    </motion.div>
  );
};

export default HomePage;