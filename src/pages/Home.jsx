// src/pages/Home.jsx
import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchMovies } from "../services/api";
import Navbar from "../components/Navbar";
import Recommendations from "../components/Recommendations";  // ← new import
import "./Home.css";

function Home() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Stable background URL
  const backgroundImage = useMemo(
    () => `${import.meta.env.BASE_URL}images/image1.jpg`,
    []
  );

  // Preload background
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
  }, [backgroundImage]);

  // Restore prior search if coming back
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  // Live‐search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
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
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="home-container">
      <Navbar />

      {/* Background */}
      <div className="background-wrapper">
        <div
          className="background-image"
          style={{ backgroundImage: `url(${backgroundImage})`, opacity: 1 }}
        />
        <div className="overlay" />
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
          onKeyDown={(e) => e.key === "Enter" && setSearchQuery(e.target.value)}
        />

        <div className="movie-grid-container">
          <div className="movie-grid">
            {isLoading ? (
              <div className="loading-spinner" />
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

      {/* Recommendations Tiles */}
      <Recommendations />
    </div>
  );
}

export default Home;
