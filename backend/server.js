const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cloudinary = require("cloudinary").v2; // Cloudinary Import
const connectDB = require("./config/db");

// Routes Import
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();
connectDB();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// Razorpay Config
app.get("/api/config/razorpay", (req, res) => {
  res.send(process.env.RAZORPAY_KEY_ID);
});

const __dirname_resolved = path.resolve();
app.use("/uploads", express.static(path.join(__dirname_resolved, "/uploads")));

// --- PRODUCTION DEPLOYMENT LOGIC ---
if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname_resolved, "/frontend/build");

  app.use(express.static(buildPath));

  app.use((req, res, next) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(buildPath, "index.html"));
    } else {
      next();
    }
  });
} else {
  app.get("/", (req, res) => {
    res.send("ShopFusion API is running perfectly...");
  });
}

// Error Handling
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
