// src/hooks/useSearchHistory.js

import { useState, useEffect } from "react";

const STORAGE_KEY = "searchHistory";
const MAX_HISTORY = 5;

export function useSearchHistory() {
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addSearch = (q) => {
    if (!q) return;
    setHistory((prev) => {
      // remove duplicate and prepend new term
      const deduped = prev.filter((x) => x !== q);
      return [q, ...deduped].slice(0, MAX_HISTORY);
    });
  };

  return { history, addSearch };
}
