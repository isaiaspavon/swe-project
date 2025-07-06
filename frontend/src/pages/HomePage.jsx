import { useState, useEffect } from "react";
import { fetchBooks } from "../firebaseConfig";
import BookCarousel from "../components/BookCarousel"; // ✅ you're using this now
import "./HomePage.css";

const HomePage = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks((loadedBooks) => {
      setBooks(loadedBooks);
    });
  }, []);

  const topSellers = books.filter((book) => book.category === "top-seller");
  const comingSoon = books.filter((book) => book.category === "coming-soon");

  return (
    <div className="homepage">
      <h2>Best Sellers</h2>
      <BookCarousel books={topSellers} /> {/* ✅ Carousel instead of map */}

      <h2>Coming Soon</h2>
      <BookCarousel books={comingSoon} /> {/* ✅ Carousel instead of map */}
    </div>
  );
};

export default HomePage;
