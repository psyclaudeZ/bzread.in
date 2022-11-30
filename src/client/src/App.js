import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./components/footer";
import Header from "./components/header";
import About from "./pages/about";
import Episode from "./pages/episode";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route exact path="/" element={<Episode />} />
          <Route exact path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
