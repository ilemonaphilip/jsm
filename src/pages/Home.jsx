import { useState, useEffect } from "react";
import { fetchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import Navbar from "../components/Navbar";

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const images = [
    "/jsm/images/image1.jpg",
    "/jsm/images/image2.jpg",
    "/jsm/images/image3.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setMovies([]);
      setHasSearched(false);
      return;
    }

    async function fetchMoviesData() {
      const data = await fetchMovies(searchQuery);
      setMovies(data);
      setHasSearched(true);
    }
    fetchMoviesData();
  }, [searchQuery]);

  return (
    <div className="relative min-h-screen flex flex-col items-center text-white">
      <Navbar />

      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
        }}
      />

      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 w-full max-w-6xl text-center p-12">
        <h1 className="text-5xl font-extrabold mb-8">Find Your Favorite Movies</h1>

        <input
          type="text"
          placeholder="Search movies..."
          className="p-3 w-full max-w-lg border border-gray-600 rounded-lg bg-gray-800 text-white text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
          {movies.length > 0 ? (
            movies.map((movie) => <MovieCard key={movie.imdbID} movie={movie} />)
          ) : (
            <p className="col-span-full text-gray-300 text-lg">No movies found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
