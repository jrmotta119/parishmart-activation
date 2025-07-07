import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// Conditional import for tempo devtools
if (import.meta.env.VITE_TEMPO === "true") {
  try {
    const { TempoDevtools } = require("tempo-devtools");
    TempoDevtools.init();
  } catch (error) {
    console.warn("Tempo devtools not available");
  }
}

const basename = "/";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
