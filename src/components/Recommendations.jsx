import { useEffect, useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { useSearchHistory } from "../hooks/useSearchHistory";
import {
  findTMDBIdByImdb,
  fetchSimilarMovies,
  fetchMovies,
} from "../services/api";
import MovieCard from "./MovieCard";
import "./Recommendations.css";     // ← Import our new CSS

export default function Recommendations() {
  const { favorites } = useFavorites();
  const { history } = useSearchHistory();
  const [byFav, setByFav] = useState([]);
  const [bySearch, setBySearch] = useState([]);

  // Recommendations based on first favorite
  useEffect(() => {
    async function loadFavRecs() {
      if (favorites.length === 0) return;
      const tmdbId = await findTMDBIdByImdb(favorites[0]);
      if (!tmdbId) return;
      const sims = await fetchSimilarMovies(tmdbId);
      setByFav(sims.slice(0, 8));
    }
    loadFavRecs();
  }, [favorites]);

  // Recommendations based on most recent search
  useEffect(() => {
    async function loadSearchRecs() {
      if (history.length === 0) return;
      const recents = await fetchMovies(history[0]);
      setBySearch(recents.slice(0, 8));
    }
    loadSearchRecs();
  }, [history]);

  // Hide entirely if nothing to show
  if (byFav.length === 0 && bySearch.length === 0) return null;

  return (
    <div className="recommendations">
      {byFav.length > 0 && (
        <div className="recommend-block">
          <h2 className="recommend-title">What To Watch Next</h2>
          <div className="recommend-grid">
            {byFav.map((m) => (
              <MovieCard
                key={m.id}
                movie={{
                  imdbID: m.imdb_id || m.id,
                  Title: m.title,
                  Poster: m.poster_path
                    ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                    : "",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {bySearch.length > 0 && (
        <div className="recommend-block">
          <h2 className="recommend-title">
            Based on your recent search “{history[0]}”
          </h2>
          <div className="recommend-grid">
            {bySearch.map((m) => (
              <MovieCard key={m.imdbID} movie={m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
