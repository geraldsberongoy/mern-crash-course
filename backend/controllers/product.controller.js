import Product from "../models/product.model.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/errorHandler.js";

/**
 * Get all products with filtering, pagination, and search
 * @route GET /api/products
 */
export const getProducts = async (req, res, next) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Filter by creator if provided
    if (req.query.creator) {
      filter.creator = req.query.creator;
    }

    // Filter by price range if provided
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    // Search functionality
    if (req.query.search) {
      // Use text index for search if available
      filter.$text = { $search: req.query.search };
    } else if (req.query.name) {
      // Or allow direct name filtering with regex for partial matches
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    // Get products with sorting
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Execute query with all conditions
    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip(skip);

    // Get total count for pagination info
    const total = await Product.countDocuments(filter);

    console.log(
      `Products fetched: ${products.length}, with search: ${
        req.query.search || "none"
      }`
    );

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by ID
 * @route GET /api/products/:id
 */
export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid product ID format", 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      throw new ApiError(`Product with id ${id} not found`, 404);
    }

    console.log("Product fetched:", product.name);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product
 * @route POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, image, discount, creator, description, stock } =
      req.body;

    // Input validation
    if (!name || !price || !image) {
      throw new ApiError("Please provide name, price, and image", 400);
    }

    // Validate price is a positive number
    if (isNaN(price) || price <= 0) {
      throw new ApiError("Price must be a positive number", 400);
    }

    const newProduct = new Product({
      name,
      price,
      image,
      discount: discount || 0,
      creator: creator || "Unknown",
      description,
      stock,
    });

    await newProduct.save();
    console.log("Product created:", newProduct.name);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 * @route PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid product ID format", 400);
    }

    // Find product first to check if it exists
    const product = await Product.findById(id);

    if (!product) {
      throw new ApiError(`Product with id ${id} not found`, 404);
    }

    // If price is being updated, validate it
    if (updates.price && (isNaN(updates.price) || updates.price <= 0)) {
      throw new ApiError("Price must be a positive number", 400);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    console.log("Product updated:", updatedProduct.name);
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 * @route DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid product ID format", 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      throw new ApiError(`Product with id ${id} not found`, 404);
    }

    await Product.findByIdAndDelete(id);

    console.log(`Product deleted: ${product.name} (${id})`);
    res.status(200).json({
      success: true,
      message: "Product successfully deleted",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};
