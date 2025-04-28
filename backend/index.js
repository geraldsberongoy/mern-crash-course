import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import logger from "./middlewares/logger.js";
import securityHeaders from "./middlewares/security.js";
import cors from "cors";
import { errorHandler } from "./utils/errorHandler.js";

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

// Security headers middleware
app.use(securityHeaders);

// Middleware
app.use(express.json()); // allow us to accept JSON data in a body of a request
app.use(express.urlencoded({ extended: false })); // allow us to accept form data

// Use CORS middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware logger
app.use(logger);

// Routes
app.use("/api/products", productRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  connectDB();
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
