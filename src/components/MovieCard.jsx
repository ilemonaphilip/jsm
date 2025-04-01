import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg text-center shadow-lg">
      <img src={movie.Poster} alt={movie.Title} className="w-full h-60 object-cover rounded-md" />
      <h3 className="mt-2 font-bold">{movie.Title}</h3>
      <p>{movie.Year}</p>
      <Link to={`/movie/${movie.imdbID}`} className="text-blue-400 hover:underline">
        View Details
      </Link>
    </div>
  );
}

export default MovieCard;
