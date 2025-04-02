import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchMovies } from "../services/api";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Background slideshow states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(null);

  // Use relative paths (ensure these images exist in your public/images folder)
  const images = [
    "/images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
  ];

  // If coming back from MovieDetails, restore the search query
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  // When searchQuery changes, fetch movies (after a slight delay)
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setMovies([]);
      setSearchActive(false);
      setHasSearched(false);
      return;
    }
    setSearchActive(true);
    const timer = setTimeout(async () => {
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
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Background slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        setPrevImageIndex(prevIndex);
        const newIndex = (prevIndex + 1) % images.length;
        // Clear previous image after transition (2s)
        setTimeout(() => setPrevImageIndex(null), 2000);
        return newIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="home-container">
      <Navbar />
      {/* Background */}
      <div className="background-wrapper">
        {prevImageIndex !== null && (
          <div
            className="background-image"
            style={{
              backgroundImage: `url(${images[prevImageIndex]})`,
              opacity: 0,
            }}
          />
        )}
        <div
          className="background-image"
          style={{
            backgroundImage: `url(${images[currentImageIndex]})`,
            opacity: 1,
          }}
        />
        <div className="overlay"></div>
      </div>
      <div className="content">
        <h1 className={searchActive ? "hidden" : ""}>
          Find Your Favorite Movies
        </h1>
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
                <Link
                  key={movie.imdbID}
                  to={`/movie/${movie.imdbID}`}
                  state={{ searchQuery }}
                >
                  <div className="movie-card">
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="movie-poster"
                    />
                    <h3>{movie.Title}</h3>
                  </div>
                </Link>
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
