import { useState, useEffect } from "react";
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

  // Filter books based on search
  const filteredBooks = books.filter((book) => {
    if (!searchQuery) return true;
    const value = searchQuery.toLowerCase();
    if (searchFilter === "title") return book.title.toLowerCase().includes(value);
    if (searchFilter === "author") return book.author.toLowerCase().includes(value);
    if (searchFilter === "genre") return (book.genre || "").toLowerCase().includes(value);
    return true;
  });

  const topSellers = filteredBooks.filter((book) => book.category === "top-seller");
  const comingSoon = filteredBooks.filter((book) => book.category === "coming-soon");

  return (
    <div className="homepage">
      <h2>Best Sellers</h2>
      <BookCarousel books={topSellers} />

      <h2>Coming Soon</h2>
      <BookCarousel books={comingSoon} />
    </div>
  );
};

export default HomePage;