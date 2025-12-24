const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  createRazorpayOrder,
  getOrders,
  updateOrderToDelivered,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// Admin gets all orders, User creates order
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);

router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid); //
router.route("/:id/razorpay").post(protect, createRazorpayOrder); //

// Admin delivers order
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

module.exports = router;
