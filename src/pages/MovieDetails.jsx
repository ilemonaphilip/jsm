import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { fetchMovieDetails } from "../services/Api";
import "./MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const previousSearch = location.state?.searchQuery || "";

  const [movie, setMovie] = useState(null);
  // States for review functionality
  const [userRating, setUserRating] = useState("");
  const [userReview, setUserReview] = useState("");
  const [reviews, setReviews] = useState([]);

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

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Create a review object; in production, to send to backend
    const newReview = {
      rating: userRating,
      text: userReview,
      date: new Date().toLocaleString(),
    };
    // To prepend the new review to the list
    setReviews([newReview, ...reviews]);
    // Clear form fields
    setUserRating("");
    setUserReview("");
  };

  if (!movie) return <div className="movie-loading">Loading movie details...</div>;

  return (
    <div className="movie-container">
      {/* Navbar */}
      <div className="navbar">
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
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <div className="review-item">
              <label htmlFor="reviewText">Review:</label>
              <textarea
                id="reviewText"
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                rows="4"
                placeholder="Write your review here..."
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Submit Review
            </button>
          </form>

          {/* Display Reviews if any exist */}
          {reviews.length > 0 && (
            <div className="reviews-list">
              <h3>User Reviews:</h3>
              {reviews.map((review, index) => (
                <div key={index} className="review">
                  <div className="review-header">
                    <span className="review-rating">
                      Rating: {review.rating} Star{review.rating !== "1" ? "s" : ""}
                    </span>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
