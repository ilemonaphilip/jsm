import { useState, useEffect } from "react";
import { fetchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const images = [
    `${import.meta.env.BASE_URL}images/image1.jpg`,
    `${import.meta.env.BASE_URL}images/image2.jpg`,
    `${import.meta.env.BASE_URL}images/image3.jpg`
  ];

  // Background slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Movie search effect
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setMovies([]);
      setHasSearched(false);
      return;
    }

    const searchDelay = setTimeout(() => {
      async function fetchMoviesData() {
        setIsLoading(true);
        try {
          const data = await fetchMovies(searchQuery);
          setMovies(data);
          setHasSearched(true);
        } catch (error) {
          console.error("Error fetching movies:", error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchMoviesData();
    }, 500); // Small delay to prevent rapid API calls

    return () => clearTimeout(searchDelay);
  }, [searchQuery]);

  return (
    <div className="home-container">
      <Navbar />
      
      {/* Background Elements */}
      <div
        className="background-image"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      />
      <div className="overlay"></div>

      {/* Main Content */}
      <div className="content">
        <h1>Find Your Favorite Movies</h1>
        
        <input
          type="text"
          placeholder="Search movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="movie-grid-container">
          <div className="movie-grid">
            {isLoading ? (
              <div className="loading-spinner"></div>
            ) : movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))
            ) : (
              hasSearched && <p className="no-movies">No movies found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;