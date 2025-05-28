import React from "react";
import ReactDOM from "react-dom/client";
import "./firebaseConfig"; // Firebase Working: Imports Firebase configuration to initialize the app.
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);