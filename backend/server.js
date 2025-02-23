import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import logger from "./middleware/logger.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json()); // allow us to accept JSON data in a body of a request
app.use(express.urlencoded({ extended: false })); // allow us to accept form data

// Middleware logger
app.use(logger);

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  connectDB();
});
