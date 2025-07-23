import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getUserCart, setCartBook, removeCartBook, clearUserCart } from "../firebaseConfig";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState({}); // { bookId: { bookId, quantity } }

  // Load cart from Firebase on login
  useEffect(() => {
    if (currentUser) {
      getUserCart(currentUser.uid).then(setCart);
    } else {
      setCart({});
    }
  }, [currentUser]);

  // Add or update a cartBook
  const addOrUpdateCartBook = async (bookId, quantity) => {
    if (!currentUser) return;
    await setCartBook(currentUser.uid, bookId, quantity);
    setCart(prev => {
      const updated = { ...prev };
      if (quantity > 0) {
        updated[bookId] = { bookId, quantity };
      } else {
        delete updated[bookId];
      }
      return updated;
    });
  };

  // Remove a cartBook
  const removeFromCart = async (bookId) => {
    if (!currentUser) return;
    await removeCartBook(currentUser.uid, bookId);
    setCart(prev => {
      const updated = { ...prev };
      delete updated[bookId];
      return updated;
    });
  };

  // Clear cart
  const clearCart = async () => {
    if (!currentUser) return;
    await clearUserCart(currentUser.uid);
    setCart({});
  };

  // Get total items
  const getCartCount = () => Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  // Get all cartBooks as array
  const getCartBooks = () => Object.values(cart);

  return (
    <CartContext.Provider value={{
      cart,
      addOrUpdateCartBook,
      removeFromCart,
      clearCart,
      getCartCount,
      getCartBooks
    }}>
      {children}
    </CartContext.Provider>
  );
};