// src/services/api.js

// ——————————————————————————————
//  OMDB (your existing setup)
// ——————————————————————————————
const OMDB_API_KEY = "b96d2433";
const OMDB_BASE    = "https://www.omdbapi.com/";

export async function fetchMovies(searchQuery) {
  try {
    const res  = await fetch(
      `${OMDB_BASE}?s=${encodeURIComponent(searchQuery)}&apikey=${OMDB_API_KEY}`
    );
    const data = await res.json();
    return data.Response === "True" ? data.Search : [];
  } catch (e) {
    console.error("OMDB fetchMovies error:", e);
    return [];
  }
}

export async function fetchMovieDetailsOMDB(imdbID) {
  try {
    const res  = await fetch(
      `${OMDB_BASE}?i=${encodeURIComponent(imdbID)}&apikey=${OMDB_API_KEY}`
    );
    const data = await res.json();
    return data.Response === "True" ? data : null;
  } catch (e) {
    console.error("OMDB fetchMovieDetails error:", e);
    return null;
  }
}

// ——————————————————————————————
//  TMDB (requires you set VITE_TMDB_API_KEY in .env)
// ——————————————————————————————
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE    = "https://api.themoviedb.org/3";

/**
 * 1. Find the TMDB movie by its IMDb ID
 */
export async function findTMDBIdByImdb(imdbID) {
  const res  = await fetch(
    `${TMDB_BASE}/find/${imdbID}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
  );
  const data = await res.json();
  // results.movie_results is an array; take the first match’s id
  return data.movie_results?.[0]?.id || null;
}

/**
 * 2. Fetch videos (trailers, teasers, etc.)
 */
export async function fetchTMDBVideos(tmdbId) {
  if (!tmdbId) return [];
  const res  = await fetch(
    `${TMDB_BASE}/movie/${tmdbId}/videos?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results || [];
}

/**
 * 3. Fetch watch providers (stream, rent, buy) by country
 */
export async function fetchWatchProviders(tmdbId) {
  if (!tmdbId) return {};
  const res  = await fetch(
    `${TMDB_BASE}/movie/${tmdbId}/watch/providers?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results || {};
}

/**
 * 4. Fetch movies similar to a given TMDB ID
 */
export async function fetchSimilarMovies(tmdbId) {
  if (!tmdbId) return [];
  const res  = await fetch(
    `${TMDB_BASE}/movie/${tmdbId}/similar?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results || [];
}

// 5. Fetch TMDB‐based recommendations
export async function fetchTMDBRecommendations(tmdbId) {
  if (!tmdbId) return [];
  const res  = await fetch(
    `${TMDB_BASE}/movie/${tmdbId}/recommendations?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results || [];
}

// 6. Map a TMDB ID → its IMDb ID
export async function fetchExternalImdbId(tmdbId) {
  if (!tmdbId) return null;
  const res  = await fetch(
    `${TMDB_BASE}/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.imdb_id;  // e.g. "tt0111161"
}
