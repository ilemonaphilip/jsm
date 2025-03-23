const API_KEY = "b96d2433"; // Your OMDB API Key
const BASE_URL = "http://www.omdbapi.com/";

export async function fetchMovies(searchQuery) {
  try {
    const response = await fetch(`${BASE_URL}?s=${searchQuery}&apikey=${API_KEY}`);
    const data = await response.json();
    if (data.Response === "True") {
      return data.Search; // Returns an array of movies
    } else {
      return []; // Returns an empty array if no movies found
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

export async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(`${BASE_URL}?i=${movieId}&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}
