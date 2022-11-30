import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div>
      <div className="header-flex-container">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h2>bzread.in</h2>
        </Link>
        <nav>
          <Link
            to="/about"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            about
          </Link>
        </nav>
      </div>
      <hr></hr>
    </div>
  );
};

export default Header;