import Navbar from "../components/Navbar";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      <Navbar />

      {/* Background + Overlay */}
      <div className="background-wrapper">
        <div
          className="background-image"
          style={{ 
            /*to put a background image here later*/
            backgroundImage: `url("https://via.placeholder.com/1920x1080?text=About+Background")`, 
            opacity: 1
          }}
        />
        <div className="overlay"></div>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <h1>About Us</h1>
        <p>
          This is a simple movie search app built using React and Vite. 
          You can search for movies and see details about them. 
          <br /><br />
          The goal of this project is to get users to view movie title, rate movies and write reviews.
        </p>
      </div>
    </div>
  );
}

export default About;
