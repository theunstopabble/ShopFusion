const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = express.Router();

// Cloudinary Storage Engine Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ShopFusion_Products", // Cloudinary mein is naam ka folder ban jayega
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Auto-resize for grand performance
  },
});

const upload = multer({ storage });

// Image upload route
router.post("/", upload.single("image"), (req, res) => {
  if (req.file && req.file.path) {
    // req.file.path ab local address nahi balki Cloudinary ka URL hoga
    res.send(req.file.path);
  } else {
    res.status(400).send({ message: "No image uploaded" });
  }
});

module.exports = router;
