import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <div className="header-flex-container">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h2>bzread.in</h2>
        </Link>
        <nav>
          <Link to="/about" style={{ textDecoration: "none", color: "#777" }}>
            about
          </Link>
          <a
            href="/rss.xml"
            style={{ textDecoration: "none", color: "#777", marginLeft: "8px" }}
          >
            rss
          </a>
        </nav>
      </div>
      <hr></hr>
    </div>
  );
};

export default Header;
