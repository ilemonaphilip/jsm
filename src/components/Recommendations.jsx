import { useEffect, useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { useSearchHistory } from "../hooks/useSearchHistory";
import {
  findTMDBIdByImdb,
  fetchTMDBRecommendations,
  fetchExternalImdbId,
  fetchMovies,
} from "../services/api";
import MovieCard from "./MovieCard";
import "./Recommendations.css";

export default function Recommendations() {
  const { favorites } = useFavorites();
  const { history }   = useSearchHistory();
  const [byFav, setByFav]     = useState([]);
  const [bySearch, setBySearch] = useState([]);

  // 🌟 TMDB‐trained recs
  useEffect(() => {
    async function loadFavRecs() {
      if (!favorites.length) return;
      const tmdbId = await findTMDBIdByImdb(favorites[0]);
      if (!tmdbId) return;
      const recs = await fetchTMDBRecommendations(tmdbId);
      const enriched = await Promise.all(
        recs.slice(0, 8).map(async (m) => ({
          imdbID: await fetchExternalImdbId(m.id),
          Title: m.title,
          Poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
            : "",
        }))
      );
      setByFav(enriched);
    }
    loadFavRecs();
  }, [favorites]);

  // 🔍 search‐based recs
  useEffect(() => {
    async function loadSearchRecs() {
      if (!history.length) return;
      const recents = await fetchMovies(history[0]);
      setBySearch(recents.slice(0, 8));
    }
    loadSearchRecs();
  }, [history]);

  if (!byFav.length && !bySearch.length) return null;

  return (
    <div className="recommendations">
      {byFav.length > 0 && (
        <div className="recommend-block">
          <h2 className="recommend-title">Because you liked…</h2>
          <div className="recommend-grid">
            {byFav.map((m) => (
              <MovieCard key={m.imdbID} movie={m} />
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
