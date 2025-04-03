// src/pages/Home.jsx
import { useState, useEffect, useMemo } from "react";
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

  // Use a single background image; useMemo to keep it stable across renders.
  const backgroundImage = `${import.meta.env.BASE_URL}images/image1.jpg`;

  // Preload the background image once on mount.
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
  }, [backgroundImage]);

  // Restore search query if coming back from MovieDetails.
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  // Fetch movies when searchQuery changes.
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

  return (
    <div className="home-container">
      <Navbar />
      {/* Background */}
      <div className="background-wrapper">
        <div
          className="background-image"
          style={{
            backgroundImage: `url(${backgroundImage})`,
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
