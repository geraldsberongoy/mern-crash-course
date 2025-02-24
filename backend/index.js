import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.route.js";
import logger from "./middlewares/logger.js";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json()); // allow us to accept JSON data in a body of a request
app.use(express.urlencoded({ extended: false })); // allow us to accept form data

// Use CORS middleware
const corsOptions = {
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware logger
app.use(logger);

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  connectDB();
});
