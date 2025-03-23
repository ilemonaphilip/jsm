import { useState, useEffect } from "react";
import { fetchMovies } from "../services/Api";
import MovieCard from "../components/MovieCard";

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("avenger");

  useEffect(() => {
    async function getMovies() {
      const data = await fetchMovies(searchQuery);
      setMovies(data);
    }
    getMovies();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Movie App</h1>
      <input
        type="text"
        placeholder="Search movies..."
        className="p-2 w-full max-w-md border border-gray-600 rounded-md bg-gray-800 text-white"
      />
      <div>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Home;
