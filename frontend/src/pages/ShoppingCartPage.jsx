import { useState, useEffect } from "react";
import { fetchBooks } from "../firebaseConfig"; // this should return the books from your DB
import BookCard from "../components/BookCard";
import "./ShoppingCartPage.css"
import React from "react";
import ShoppingCartItem from "../components/ShoppingCartItem";

const ShoppingCartPage = () => {
  const [books, setBooks] = useState([]);

 //need to pull customer shopping cart id info and tie to books in database

  return (
    <div className="shopping-cart-page">
      <h2 className = "cart-title">
        Cart Items:
        </h2>
      <div className = "cart-checkout">
      
      <div className="cart-flex">
        <ShoppingCartItem/>
         <ShoppingCartItem/>
         <ShoppingCartItem/>
      </div>
      <div> 
        <p>
          Estimated Total: $80.00
        </p>
        <button className = "check-out-button"> Check Out </button>
      </div>
      </div>
    </div>
  );
};

export default ShoppingCartPage;
