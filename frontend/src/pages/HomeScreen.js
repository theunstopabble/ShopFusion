import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products?keyword=${keyword}`);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );

  return (
    // Added overflow-x-hidden to prevent layout breaking
    <div className="bg-[#0f172a] min-h-screen text-white pb-20 overflow-x-hidden">
      {/* Hero Section Fix: Added relative and z-index */}
      <div className="relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-16 md:py-24 px-4 text-center bg-gradient-to-b from-[#1e293b] to-[#0f172a] relative z-10"
        >
          <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic leading-none">
            {keyword ? (
              <>
                Search <span className="text-blue-500">Results</span>
              </>
            ) : (
              <>
                Premium <span className="text-blue-500">Collections</span>
              </>
            )}
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto relative z-10">
            {keyword
              ? `Showing results for "${keyword}"`
              : "Elevate your tech game with ShopFusion's exclusive gear."}
          </p>
        </motion.div>
      </div>

      {/* Products Grid: Added z-index to stay on top */}
      <div className="container mx-auto px-6 relative z-20 -mt-8">
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-[#1e293b]/30 rounded-3xl border border-dashed border-gray-700"
          >
            <h3 className="text-2xl font-bold text-gray-500 italic">
              No products found.
            </h3>
            <Link to="/" className="text-blue-500 mt-4 block hover:underline">
              Clear Search
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="bg-[#1e293b]/50 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-500 group shadow-2xl hover:shadow-blue-500/20"
              >
                <Link
                  to={`/product/${product._id}`}
                  className="relative block aspect-square overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/10">
                    {product.brand}
                  </div>
                </Link>

                <div className="p-6">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-xl text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center mb-6 space-x-2 text-yellow-500 font-bold text-sm">
                    <Star size={16} fill="currentColor" />
                    <span>{product.rating}</span>
                    <span className="text-gray-500 font-medium">
                      | {product.numReviews} reviews
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        Price
                      </span>
                      <span className="text-3xl font-black text-white">
                        ${product.price}
                      </span>
                    </div>
                    <motion.div whileTap={{ scale: 0.8 }}>
                      <Link
                        to={`/product/${product._id}`}
                        className="bg-blue-600 hover:bg-white hover:text-blue-600 p-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/20"
                      >
                        <ShoppingCart size={24} />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
