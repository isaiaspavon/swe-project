import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const useBooks = () => {
  const [topSellers, setTopSellers] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const booksRef = ref(db, "books");

    onValue(booksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allBooks = Object.entries(data).map(([id, book]) => ({
          id,
          ...book,
        }));
        setTopSellers(allBooks.filter((book) => book.category === "top-seller"));
        setComingSoon(allBooks.filter((book) => book.category === "coming-soon"));
      }
    });
  }, []);

  return { topSellers, comingSoon };
};

export default useBooks;
