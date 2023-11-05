import React from 'react';
import Footer from './components/footer';
import Header from './components/header';
import About from './pages/about';
import Books from './pages/books';
import Episode from './pages/episode';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Header />
      <div className="app">
        <Routes>
          <Route exact path="/" element={<Episode />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/books" element={<Books />} />
          <Route path="/rss.xml" onEnter={() => window.location.reload()} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
