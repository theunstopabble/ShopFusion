const express = require("express");
const router = express.Router();
const {
  authUser,
  registerUser,
  getUsers,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Login route
router.post("/login", authUser);

// Register aur Get All Users route
router.route("/").post(registerUser).get(protect, admin, getUsers); // GET /api/users

// Delete user route
router.route("/:id").delete(protect, admin, deleteUser); // DELETE /api/users/:id

module.exports = router;
