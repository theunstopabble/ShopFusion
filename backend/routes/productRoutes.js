const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public search and Admin create
router.route("/").get(getProducts).post(protect, admin, createProduct);

// Review route (Authenticated users only)
router.route("/:id/reviews").post(protect, createProductReview);

// Specific product actions
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

module.exports = router;
