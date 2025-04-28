import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    console.log("Products fetched");
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getProduct = async (req, res, next) => {
  const { id } = req.params; // user will send this data
  try {
    const product = await Product.findById(id);
    console.log("Product fetched:", product.name);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(`Product with id ${id} cant be found  `, error.message);
    res.status(500).json({ success: false, message: "Server Error " });
  }
};

export const createProduct = async (req, res, next) => {
  const product = req.body; // user will send this data
  if (!product.name || !product.price || !product.image || !product.creator ) {
    return res
      .status(400)
      .json({ success: "false", message: "Please provide all fields" });
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    console.log("Product created:", newProduct.name);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in Create Product", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req, res, next) => {
  const { id } = req.params; // user will send this data
  const product = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Invalid Id ${id}`);
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    console.log("Product updated:", updatedProduct.name);
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params; // user will send this data

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Invalid Id ${id}`);
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }

  try {
    await Product.findByIdAndDelete(id);
    console.log(`Product with id ${id} deleted`);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error(`Product with id ${id} cant be found  `, error.message);
    res.status(500).json({ success: false, message: "Server Error " });
  }
};
