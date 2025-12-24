import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-white pb-20">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-blue-500 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 1. Product Image with Zoom Animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1e293b]/50 backdrop-blur-md rounded-[2.5rem] p-4 border border-gray-800 overflow-hidden"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-[2rem] shadow-2xl"
            />
          </motion.div>

          {/* 2. Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-blue-500 font-bold uppercase tracking-widest mb-2">
              {product.brand}
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 italic leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                <Star size={18} fill="currentColor" className="mr-1" />
                <span className="font-bold">{product.rating}</span>
              </div>
              <span className="text-gray-400 font-medium">
                {product.numReviews} Global Reviews
              </span>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 border-l-4 border-blue-600 pl-6">
              {product.description}
            </p>

            {/* Purchase Card (Amazon Style) */}
            <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">
                  Best Price
                </span>
                <span className="text-4xl font-black text-white">
                  ${product.price}
                </span>
              </div>

              <div className="flex items-center mb-8">
                <div
                  className={`h-3 w-3 rounded-full mr-3 ${
                    product.countInStock > 0
                      ? "bg-green-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`font-bold ${
                    product.countInStock > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {product.countInStock > 0
                    ? `In Stock (${product.countInStock} available)`
                    : "Out of Stock"}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex items-center justify-between mb-8 p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                  <span className="font-bold">Quantity</span>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="bg-transparent font-bold text-blue-500 outline-none cursor-pointer"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option
                        key={x + 1}
                        value={x + 1}
                        className="bg-slate-900 text-white"
                      >
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center transition-all shadow-xl ${
                  product.countInStock > 0
                    ? "bg-blue-600 hover:bg-white hover:text-blue-600 shadow-blue-600/20"
                    : "bg-gray-700 cursor-not-allowed text-gray-400"
                }`}
              >
                <ShoppingCart size={22} className="mr-3" /> Add to Shopping Cart
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="flex space-x-8 mt-8">
              <div className="flex items-center text-xs text-gray-500 font-bold uppercase tracking-tighter">
                <ShieldCheck size={16} className="mr-2 text-blue-500" /> 1 Year
                Warranty
              </div>
              <div className="flex items-center text-xs text-gray-500 font-bold uppercase tracking-tighter">
                <Truck size={16} className="mr-2 text-blue-500" /> Free Shipping
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
