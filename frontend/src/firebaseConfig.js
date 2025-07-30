// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, set, get, remove, update } from "firebase/database";

// Firebase config file
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

// Export Auth and Realtime DB services
export const auth = getAuth(app);
export const db = getDatabase(app);

// --- INVENTORY MANAGEMENT FUNCTIONS ---

// Get book inventory
export const getBookInventory = async (bookId) => {
  const bookRef = ref(db, `books/${bookId}`);
  const snapshot = await get(bookRef);
  if (snapshot.exists()) {
    const book = snapshot.val();
    return book.inventory || 0;
  }
  return 0;
};

// Update book inventory (decrease by quantity)
export const updateBookInventory = async (bookId, quantityToSubtract) => {
  const bookRef = ref(db, `books/${bookId}`);
  const snapshot = await get(bookRef);
  
  if (snapshot.exists()) {
    const book = snapshot.val();
    const currentInventory = book.inventory || 0;
    const newInventory = Math.max(0, currentInventory - quantityToSubtract);
    
    await update(bookRef, { inventory: newInventory });
    console.log(`Updated inventory for book ${bookId}: ${currentInventory} -> ${newInventory}`);
    return newInventory;
  }
  throw new Error('Book not found');
};

// Check if book has sufficient inventory
export const checkInventoryAvailability = async (bookId, requestedQuantity) => {
  const currentInventory = await getBookInventory(bookId);
  return currentInventory >= requestedQuantity;
};

// Validate cart inventory before checkout
export const validateCartInventory = async (cartItems) => {
  const validationResults = [];
  
  for (const item of cartItems) {
    const available = await checkInventoryAvailability(item.bookId, item.quantity);
    if (!available) {
      const currentInventory = await getBookInventory(item.bookId);
      validationResults.push({
        bookId: item.bookId,
        requested: item.quantity,
        available: currentInventory,
        insufficient: true
      });
    } else {
      validationResults.push({
        bookId: item.bookId,
        requested: item.quantity,
        available: await getBookInventory(item.bookId),
        insufficient: false
      });
    }
  }
  
  return validationResults;
};

// --- CART FUNCTIONS ---

// Get cart for a user
export const getUserCart = async (userId) => {
  const cartRef = ref(db, `carts/${userId}`);
  const snapshot = await get(cartRef);
  return snapshot.exists() ? snapshot.val() : {};
};

// Add or update a cartBook
export const setCartBook = async (userId, bookId, quantity) => {
  const cartBookRef = ref(db, `carts/${userId}/${bookId}`);
  if (quantity > 0) {
    await set(cartBookRef, { bookId, quantity });
  } else {
    await remove(cartBookRef);
  }
};

// Remove a cartBook
export const removeCartBook = async (userId, bookId) => {
  const cartBookRef = ref(db, `carts/${userId}/${bookId}`);
  await remove(cartBookRef);
};

// Clear the cart
export const clearUserCart = async (userId) => {
  const cartRef = ref(db, `carts/${userId}`);
  await set(cartRef, {});
};

// --- EXISTING LOGIC BELOW ---

export const fetchBooks = (callback) => {
  const db = getDatabase();
  const booksRef = ref(db, "books/");
  onValue(booksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const booksArray = Object.entries(data).map(([id, book]) => ({
        id,
        ...book,
      }));
      callback(booksArray);
    }
  });
};

export const registerUser = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user profile to Realtime Database
    await set(ref(db, 'users/' + user.uid), {
      name: userData.name,
      phone: userData.phone,
      email: email,
      address: userData.address,
      payment: userData.payment,
      status: "Inactive",
      createdAt: new Date().toISOString()
    });

    console.log("✅ User created and profile saved!");
    return { success: true };
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Realtime Database
    const userRef = ref(db, 'users/' + user.uid);
    const snapshot = await get(userRef);

    if (!user.emailVerified) {
      console.warn("❌ Email not verified");
      return { success: false, error: "Please verify your email before logging in." };
    }

    if (snapshot.exists()) {
      const userData = snapshot.val();

      // Optional: auto-update status to Active after email verification
      if (userData.status === "Inactive") {
        await set(ref(db, 'users/' + user.uid + '/status'), "Active");
      }

      console.log("✅ User logged in successfully!");
      return {
        success: true,
        user: user,
        userData: { ...userData, status: "Active" }
      };

    } else {
      console.log("User authenticated but no profile data found");
      return {
        success: true,
        user: user,
        userData: null
      };
    }
  } catch (error) {
    let friendlyMessage = error.message;
    if (error.code === "auth/invalid-credential") {
      friendlyMessage = "Incorrect email or password. Please try again.";
    }
    return { success: false, error: friendlyMessage };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("✅ User logged out successfully!");
    return { success: true };
  } catch (error) {
    console.error("❌ Logout error:", error.message);
    return { success: false, error: error.message };
  }
};