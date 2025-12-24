const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes Import
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

dotenv.config();
connectDB();

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
  // Frontend build folder ko static serve karein
  app.use(express.static(path.join(__dirname_resolved, "/frontend/build")));

  // Express 5 Compatibility: Use (.*) instead of *
  app.get("(.*)", (req, res) =>
    res.sendFile(
      path.resolve(__dirname_resolved, "frontend", "build", "index.html")
    )
  );
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
