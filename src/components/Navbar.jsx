import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white py-4 px-8 flex justify-between items-center w-full">
      <h1 className="text-3xl font-bold">Movie App</h1>
      <div className="space-x-8 text-lg">  
        <Link to="/" className="hover:text-gray-300 transition">Home</Link>
        
        <Link to="/about" className="hover:text-gray-300 transition">About Us</Link>
      </div>
    </nav>
  );
}

export default Navbar;
