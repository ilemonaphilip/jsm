// src/pages/MovieDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
  fetchMovieDetailsOMDB,
  findTMDBIdByImdb,
  fetchTMDBVideos,
  fetchWatchProviders,
} from "../services/api";
import { useFavorites } from "../hooks/useFavorites";
import "./MovieDetails.css";

export default function MovieDetails() {
  const { id: imdbID } = useParams();            // IMDb ID from route
  const navigate = useNavigate();
  const location = useLocation();
  const previousSearch = location.state?.searchQuery || "";
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const [movie, setMovie] = useState(null);       // OMDB details
  const [trailerKey, setTrailerKey] = useState("");   // YouTube key
  const [providers, setProviders] = useState([]);     // array of watch providers

  // Review state
  const [userRating, setUserRating] = useState("");
  const [userReview, setUserReview] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadAll() {
      // 1️⃣ Fetch OMDB details
      const omdb = await fetchMovieDetailsOMDB(imdbID);
      if (!omdb) return navigate("/", { replace: true });
      setMovie(omdb);

      // 2️⃣ Find the TMDB ID via the IMDb ID
      const tmdbId = await findTMDBIdByImdb(imdbID);
      if (!tmdbId) return;

      // 3️⃣ In parallel: fetch videos + providers
      const [videos, allProviders] = await Promise.all([
        fetchTMDBVideos(tmdbId),
        fetchWatchProviders(tmdbId),
      ]);

      // pick the first YouTube trailer
      const yt = videos.find((v) => v.site === "YouTube" && v.type === "Trailer");
      if (yt) setTrailerKey(yt.key);

      // pick providers for region and flatten
      const region = import.meta.env.VITE_DEFAULT_REGION || "US";
      const regionInfo = allProviders[region] || {};
      const items = [];
      for (let type of ["flatrate", "rent", "buy"]) {
        (regionInfo[type] || []).forEach((p) =>
          items.push({ ...p, type, link: regionInfo.link })
        );
      }
      setProviders(items);
    }
    loadAll();
  }, [imdbID, navigate]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      rating: userRating,
      text: userReview,
      date: new Date().toLocaleString(),
    };
    setReviews([newReview, ...reviews]);  // prepend properly
    setUserRating("");
    setUserReview("");
  };

  if (!movie) {
    return <div className="movie-loading">Loading movie details…</div>;
  }

  // Favorite state for this movie
  const fav = isFavorite(movie.imdbID);
  const toggleFav = () => fav ? removeFavorite(movie.imdbID) : addFavorite(movie.imdbID);

  return (
    <div className="movie-container">
      <nav className="navbar">
        <h1>Movie App</h1>
        <div className="nav-links">
          <button
            className="nav-button"
            onClick={() =>
              navigate("/", { state: { searchQuery: previousSearch } })
            }
          >
            Back
          </button>
          <Link className="nav-link" to="/">
            Home
          </Link>
        </div>
      </nav>

      <section className="movie-details">
        {/* Title + Favorite Toggle */}
        <div className="movie-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 className="movie-title">{movie.Title}</h1>
          <button
            onClick={toggleFav}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              fontSize: '1.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {fav ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="movie-info">
          <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
          <div className="movie-text">
            <p><strong>Year:</strong> {movie.Year}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Director:</strong> {movie.Director}</p>
            <p><strong>Plot:</strong> {movie.Plot}</p>
          </div>
        </div>

        {/* ▶️  Embed Trailer if available */}
        {trailerKey && (
          <div className="trailer-container">
            <iframe
              title="Trailer"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="trailer-iframe"
            />
          </div>
        )}

        {/* 🍿  Where to Watch */}
        {providers.length > 0 && (
          <div className="watch-providers">
            <h2>Where to Watch</h2>
            <div className="providers-grid">
              {providers.map((p) => (
                <a
                  key={p.provider_id + p.type}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="provider-card"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                    alt={p.provider_name}
                    className="provider-logo"
                  />
                  <span className="provider-name">{p.provider_name}</span>
                  <span className="provider-type">
                    {p.type === "flatrate"
                      ? "Stream"
                      : p.type === "rent"
                      ? "Rent"
                      : "Buy"}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ⭐ Rate & Review */}
        <div className="rating-review">
          <h2>Rate and Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <div className="review-item">
              <label htmlFor="rating">Rating:</label>
              <select
                id="rating"
                value={userRating}
                onChange={(e) => setUserRating(e.target.value)}
                required
              >
                <option value="">Select rating</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Star{n > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="review-item">
              <label htmlFor="reviewText">Review:</label>
              <textarea
                id="reviewText"
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                rows="4"
                placeholder="Write your review here."
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Submit Review
            </button>
          </form>

          {reviews.length > 0 && (
            <div className="reviews-list">
              <h3>User Reviews</h3>
              {reviews.map((r, i) => (
                <div key={i} className="review">
                  <div className="review-header">
                    <span className="review-rating">
                      {r.rating} Star{r.rating > 1 ? 's' : ''}
                    </span>
                    <span className="review-date">{r.date}</span>
                  </div>
                  <p className="review-text">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
