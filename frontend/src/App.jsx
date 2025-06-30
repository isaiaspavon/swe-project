import React from "react";
import HomePage from "./pages/HomePage";
import Navbar from "./components/NavBar.jsx"

function App() {
  return (
    <div className="App">
      <Navbar/>
      <div style={{ paddingTop: '80px' }}>
        <HomePage />
      </div>
    </div>
  );
}

export default App;


/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/NavBar'
import HomePage from './pages/HomePage'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  // return (
  //   <>
  //     <div>
  //       <a href="https://vite.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )

  return (
    <Router>
      <Navbar />
      <div style={{ padding: '2rem', color: 'white' }}>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/account" element={<h1>My Account</h1>} />
          <Route path="/checkout" element={<h1>Checkout</h1>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
*/