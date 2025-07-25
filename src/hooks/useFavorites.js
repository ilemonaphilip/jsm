// src/hooks/useFavorites.js
import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));

  const removeFavorite = (id) =>
    setFavorites((prev) => prev.filter((fid) => fid !== id));

  const isFavorite = (id) => favorites.includes(id);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
