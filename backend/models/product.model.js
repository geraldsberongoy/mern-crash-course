import mongoose from "mongoose";
import updatePriceMiddleware from "../middlewares/updatePriceMiddleware.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a product price"],
      min: [0.01, "Price must be at least 0.01"],
    },
    image: {
      type: String,
      required: [true, "Please add a product image URL"],
      match: [
        /^(http|https):\/\/[^ "]+$|^data:image\/[a-z]+;base64,[a-zA-Z0-9+/=]+$/,
        "Please use a valid URL with http/https or data:image format",
      ],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    updatedPrice: {
      type: Number,
      default: function () {
        return this.price;
      },
    },
    creator: {
      type: String,
      default: "Unknown",
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate discounted price virtual
productSchema.virtual("discountedPrice").get(function () {
  if (!this.discount || this.discount === 0) return this.price;
  const discountAmount = (this.price * this.discount) / 100;
  return parseFloat((this.price - discountAmount).toFixed(2));
});

// Apply the middleware to update price before save
productSchema.pre("save", updatePriceMiddleware);

// Text index for search functionality
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
