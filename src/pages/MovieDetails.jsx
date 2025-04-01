import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchMovieDetails } from "../services/api";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function loadMovieDetails() {
      try {
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error("Error loading movie details:", error);
        navigate("/", { replace: true }); // Redirect to home if error occurs
      }
    }
    loadMovieDetails();
  }, [id, navigate]);

  if (!movie) return <div className="p-6">Loading movie details...</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Navigation Header */}
      <div className="flex justify-between items-center mb-8 p-4 bg-gray-800 rounded-lg">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Results
        </button>
        
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Return Home
        </Link>
      </div>

      {/* Movie Content */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-4">{movie.Title}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <img 
            src={movie.Poster} 
            alt={movie.Title} 
            className="w-full md:w-64 h-auto rounded-lg shadow-lg"
          />
          <div className="flex-1">
            <p className="mb-2"><span className="font-semibold">Year:</span> {movie.Year}</p>
            <p className="mb-2"><span className="font-semibold">Genre:</span> {movie.Genre}</p>
            <p className="mb-2"><span className="font-semibold">Director:</span> {movie.Director}</p>
            <p className="mb-2"><span className="font-semibold">Plot:</span></p>
            <p className="text-gray-300">{movie.Plot}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;