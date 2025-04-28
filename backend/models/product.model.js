import mongoose from "mongoose";
import updatePriceMiddleware from "../middlewares/updatePriceMiddleware.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    updatedPrice: { type: Number },
    creator: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // this will add created at and updated at fields
  }
);

// Apply the middleware to the schema
productSchema.pre("save", updatePriceMiddleware);

const Product = mongoose.model("Product", productSchema);

export default Product;
