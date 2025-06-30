import { useState, useEffect } from "react";
import { fetchBooks } from "../firebaseConfig"; // this should return the books from your DB
import BookCard from "../components/BookCard";
import "./HomePage.css"

const HomePage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks((loadedBooks) => {
      setBooks(loadedBooks);
    });
  }, []);

  // Separate books by category
  const topSellers = books.filter(book => book.category === "top-seller");
  const comingSoon = books.filter(book => book.category === "coming-soon");

  return (
    <div className="homepage">
      <h2>Best Sellers</h2>
      <div className="book-grid">
        {topSellers.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>

      <h2>Coming Soon</h2>
      <div className="book-grid">
        {comingSoon.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
