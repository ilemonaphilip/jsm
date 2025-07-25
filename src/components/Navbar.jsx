import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h1>Movie App</h1>
      <div>
        {/* Always navigates to home */}
        <Link to="/">Home</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/about">About Us</Link>
      </div>
    </nav>
  );
}

export default Navbar;
