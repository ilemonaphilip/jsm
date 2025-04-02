import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchMovieDetails } from "../services/api";
import "./MovieDetails.css";
import { useLocation } from "react-router-dom";

function MovieDetails() {
  const location = useLocation();
const previousSearch = location.state?.searchQuery || "";
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  
  // State for user rating and review
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");

  const handleSubmitReview = () => {
    console.log("User Rating:", userRating);
    console.log("User Review:", userReview);
    alert("Thank you for your review!");
    // Reset the review form
    setUserRating(0);
    setUserReview("");
  };

  useEffect(() => {
    async function loadMovieDetails() {
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error("Error loading movie details:", error);
        navigate("/", { replace: true });
      }
    }
    loadMovieDetails();
  }, [id, navigate]);

  if (!movie)
    return (
      <div className="container">
        <p className="loading-text">Loading movie details...</p>
      </div>
    );

  return (
    <div className="container">
      {/* Navbar */}
      <div className="navbar">
        <h1>Movie App</h1>
        <div className="nav-links">
          <button className="nav-button" onClick={() => navigate("/", { state: { searchQuery: previousSearch } })}
          >Back</button>
          <Link className="nav-link" to="/">Home</Link>
        </div>
      </div>

      {/* Movie Details Section */}
      <div className="movie-details">
        <h1 className="movie-title">{movie.Title}</h1>
        <div className="movie-info">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="movie-poster"
          />
          <div className="movie-text">
            <p>
              <span>Year:</span> {movie.Year}
            </p>
            <p>
              <span>Genre:</span> {movie.Genre}
            </p>
            <p>
              <span>Director:</span> {movie.Director}
            </p>
            <p>
              <span>Plot:</span> {movie.Plot}
            </p>
          </div>
        </div>

        {/* Rating & Review Section */}
        <div className="rating-review">
          <h2>Rate and Review</h2>
          <div className="review-item">
            <label>Rating:</label>
            <select
              value={userRating}
              onChange={(e) => setUserRating(e.target.value)}
            >
              <option value="0">Select rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div className="review-item">
            <label>Review:</label>
            <textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              rows="4"
              placeholder="Write your review here..."
            ></textarea>
          </div>
          <button className="submit-button" onClick={handleSubmitReview}>
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
