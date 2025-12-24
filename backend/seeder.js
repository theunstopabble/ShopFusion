const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const products = require("./data/products");
const Product = require("./models/productModel");
// Connection logic (aapki DB config file se)
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany(); // Purana data clear karne ke liye
    await Product.insertMany(products); // Naya data dalne ke liye

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
