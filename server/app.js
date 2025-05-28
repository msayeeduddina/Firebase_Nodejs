// Backend: Main entry point for the Express application.
const express = require("express");
const cors = require("cors");
// Backend: Load environment variables from .env file.
require("dotenv").config();

// Architecture: Import Firebase setup and controllers/routes.
const { db } = require("./config/firebaseConfig"); // Ensure Firebase is initialized.
const itemRoutes = require("./routes/itemRoutes");

// Initialize the Express application
const app = express();

// Middleware: Enable Cross-Origin Resource Sharing for frontend communication.
app.use(cors());
// Middleware: Parse incoming JSON request bodies.
app.use(express.json());

// System Design: Define base route for item-related API endpoints.
app.use("/items", itemRoutes);

// Backend: Global error handling middleware.
// Architecture: Catches errors thrown by asynchronous operations and sends appropriate responses.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});

// Define the port on which the server will listen.
const PORT = process.env.PORT || 3001;

// Start the server and log the port number.
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Backend: Graceful shutdown for the server.
// System Design: Handles process termination signals to ensure clean resource release.
process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});