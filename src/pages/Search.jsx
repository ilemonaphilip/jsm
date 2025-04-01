import { useState } from "react";
import { fetchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    const data = await fetchMovies(searchQuery);
    setMovies(data);
  };

  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Search Movies</h1>
      <input
        type="text"
        placeholder="Enter movie name"
        className="p-2 w-full max-w-md border border-gray-600 rounded-md bg-gray-800 text-white mt-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white py-2 px-4 rounded-md mt-4"
      >
        Search
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="col-span-full text-gray-300">No movies found.</p>
        )}
      </div>
    </div>
  );
}

export default Search;
