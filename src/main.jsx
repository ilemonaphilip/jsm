import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom"; // Using HashRouter instead of BrowseRouter
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter> {/* Ensuring correct routing */}
      <App />
    </HashRouter>
  </StrictMode>
);
