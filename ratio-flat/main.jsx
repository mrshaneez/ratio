import React from "react";
import { createRoot } from "react-dom/client";
import { installStorage } from "./storage.js";
import Ratio from "./Ratio.jsx";

installStorage();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Ratio />
  </React.StrictMode>
);
