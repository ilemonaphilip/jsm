// src/components/MovieCard.jsx
import { Link } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";

export default function MovieCard({ movie }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(movie.imdbID);

  const toggleFav = () => {
    fav ? removeFavorite(movie.imdbID) : addFavorite(movie.imdbID);
  };

  return (
    <div className="movie-card relative">
      <Link to={`/movie/${movie.imdbID}`} state={{ searchQuery: "" }}>
        <img src={movie.Poster} alt={movie.Title} className="w-full rounded" />
        <h3 className="mt-2 text-center">{movie.Title}</h3>
      </Link>
      <button
        onClick={toggleFav}
        className="absolute top-2 right-2 text-xl"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      >
        {fav ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
