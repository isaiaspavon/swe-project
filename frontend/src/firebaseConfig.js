// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

// Firebase config file
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjUpA0011FObYX3xsKF8G9zWxUaRlk9ig",
  authDomain: "swe-database-3ba25.firebaseapp.com",
  databaseURL: "https://swe-database-3ba25-default-rtdb.firebaseio.com",
  projectId: "swe-database-3ba25",
  storageBucket: "swe-database-3ba25.firebasestorage.app",
  messagingSenderId: "504638588087",
  appId: "1:504638588087:web:531b9a9191ac1da8ee7932",
  measurementId: "G-3DRB2W92KY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Export Auth and Realtime DB services
export const auth = getAuth(app);
export const db = getDatabase(app);

export const fetchBooks = (callback) => {
  const db = getDatabase();
  const booksRef = ref(db, "books/");
  onValue(booksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const booksArray = Object.values(data);
      callback(booksArray);
    }
  });
};
