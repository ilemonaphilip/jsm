import { useState, useEffect } from "react";
import { fetchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  // Background slideshow states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(null);

  const images = [
    `${import.meta.env.BASE_URL}images/image1.jpg`,
    `${import.meta.env.BASE_URL}images/image2.jpg`,
    `${import.meta.env.BASE_URL}images/image3.jpg`
  ];

  // Background slideshow effect with smooth fade
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        setPrevImageIndex(prevIndex);
        const newIndex = (prevIndex + 1) % images.length;
        // Clear previous image after transition duration
        setTimeout(() => setPrevImageIndex(null), 2000);
        return newIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Search effect: fetch movies when user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      // User cleared search: clear movies and revert search bar position.
      setMovies([]);
      setHasSearched(false);
      setSearchActive(false);
      return;
    }
    // When there is text, pin the bar.
    setSearchActive(true);
    const delay = setTimeout(async () => {
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
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <div className="home-container">
      <Navbar />

      {/* Background Wrapper with Overlay nested */}
      <div className="background-wrapper">
        {prevImageIndex !== null && (
          <div
            className="background-image"
            style={{ backgroundImage: `url(${images[prevImageIndex]})`, opacity: 0 }}
          />
        )}
        <div
          className="background-image"
          style={{ backgroundImage: `url(${images[currentImageIndex]})`, opacity: 1 }}
        />
        <div className="overlay"></div>
      </div>

      <div className="content">
        <h1 className={searchActive ? "hidden" : ""}>Find Your Favorite Movies</h1>

        <input
          type="text"
          placeholder="Search movies..."
          className={`search-input ${searchActive ? "search-active" : ""}`}
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
