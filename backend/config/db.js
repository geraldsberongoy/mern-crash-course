import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const options = {
      // These options improve MongoDB connection reliability
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      autoIndex: true,
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Add connection event listeners for better monitoring
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.info("MongoDB reconnected");
    });
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // process code 1 means exit with failure
  }
};
