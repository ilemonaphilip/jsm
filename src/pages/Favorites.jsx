import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { fetchMovieDetailsOMDB } from "../services/api";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";
import "./Favorites.css";

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function loadFavorites() {
      const results = await Promise.all(
        favorites.map((id) => fetchMovieDetailsOMDB(id))
      );
      setMovies(results.filter((m) => m));
    }
    loadFavorites();
  }, [favorites]);

  return (
    <>
      <Navbar />
      {movies.length === 0 ? (
        <p className="favorites-empty">
          You haven’t added any favorites yet.
        </p>
      ) : (
        <div className="favorites-container">
          <h1 className="favorites-title">Your Favorites</h1>
          <div className="favorites-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
