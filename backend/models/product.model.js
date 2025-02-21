import mongoose from "mongoose";

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
  },
  {
    timestamps: true, // this will add created at and updated at fields
  }
);

// Middleware to update the updatedPrice field
productSchema.pre("save", function (next) {
  this.updatedPrice = this.discount
    ? this.price - (this.price * this.discount) / 100
    : this.price;
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
