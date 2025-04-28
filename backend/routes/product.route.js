import express from "express";

import {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with optional filtering, pagination, and search
 * @access  Public
 */
router.get("/", getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get a product by id
 * @access  Public
 */
router.get("/:id", getProduct);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public
 */
router.post("/", createProduct);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product by id
 * @access  Public
 */
router.put("/:id", updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by id
 * @access  Public
 */
router.delete("/:id", deleteProduct);

export default router;
