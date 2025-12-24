import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Star,
  Laptop,
  Smartphone,
  Watch,
  Headphones,
  Tv,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Sub-Component: Compact Category Bar (Amazon Style) ---
const CategoryBar = () => {
  const categories = [
    { name: "All", icon: <Zap size={20} />, path: "/" },
    {
      name: "Electronics",
      icon: <Laptop size={20} />,
      path: "/?keyword=Electronics",
    },
    {
      name: "Mobiles",
      icon: <Smartphone size={20} />,
      path: "/?keyword=Mobile",
    },
    { name: "Audio", icon: <Headphones size={20} />, path: "/?keyword=Audio" },
    { name: "Watches", icon: <Watch size={20} />, path: "/?keyword=Watch" },
    { name: "Home Tech", icon: <Tv size={20} />, path: "/?keyword=TV" },
  ];

  return (
    // Space Fix: py-5 ko badal kar py-2 kiya taaki Navbar se chipak jaye
    <div className="bg-[#1e293b]/95 backdrop-blur-md border-b border-white/5 py-2 overflow-x-auto no-scrollbar sticky top-[64px] z-50 transition-all">
      <div className="container mx-auto px-6 flex justify-start md:justify-center space-x-10">
        {categories.map((item) => (
          <Link key={item.name} to={item.path} className="no-underline group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center cursor-pointer min-w-max text-gray-400 hover:text-blue-400 transition-all"
            >
              <div className="mb-1 p-2 bg-slate-800/50 rounded-xl group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {item.name}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// --- Sub-Component: Hero Banner Slider ---
const HeroBanner = () => {
  const slides = [
    {
      title: "Next-Gen Audio",
      subtitle: "Experience the sound of future with premium headphones.",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
      color: "from-blue-600",
    },
    {
      title: "Smart Tech Sale",
      subtitle: "Up to 40% off on latest smartphones and accessories.",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1780&auto=format&fit=crop",
      color: "from-purple-600",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[300px] md:h-[500px] w-full overflow-hidden bg-slate-900 border-b border-white/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            className="w-full h-full object-cover opacity-60"
            alt="banner"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slides[current].color}/40 to-transparent flex flex-col justify-center px-10 md:px-24`}
          >
            <motion.h1
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter"
            >
              {slides[current].title}
            </motion.h1>
            <p className="text-gray-200 text-base md:text-xl mt-4 max-w-xl">
              {slides[current].subtitle}
            </p>
            <button className="mt-8 bg-blue-600 text-white font-bold py-3 px-8 rounded-full w-max uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all text-sm">
              Shop Now
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Main HomeScreen ---
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
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );

  return (
    <div className="bg-[#0f172a] min-h-screen text-white pb-20">
      {/* 1. Category Bar (Now Slimmer) */}
      <CategoryBar />

      {/* 2. Hero Banner (Replacing Big Text) */}
      {!keyword && <HeroBanner />}

      {/* 3. Products Grid */}
      <div className="container mx-auto px-6 mt-10">
        <div className="flex items-center mb-8">
          <h2 className="text-2xl font-black uppercase italic tracking-widest border-l-4 border-blue-600 pl-4">
            {keyword ? `Results for: ${keyword}` : "Featured Collections"}
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-dashed border-gray-700">
            <h3 className="text-xl text-gray-500">
              No products found matching your criteria.
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1e293b]/50 backdrop-blur-md rounded-3xl overflow-hidden border border-gray-800 hover:border-blue-500/30 transition-all group"
              >
                <Link
                  to={`/product/${product._id}`}
                  className="block aspect-square overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 truncate group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-4 text-yellow-500 text-xs">
                    <Star size={14} fill="currentColor" />{" "}
                    <span className="ml-1 text-gray-400">
                      {product.rating} ({product.numReviews})
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-2xl font-black">
                      ${product.price}
                    </span>
                    <Link
                      to={`/product/${product._id}`}
                      className="bg-blue-600 p-3 rounded-xl hover:bg-white hover:text-blue-600 transition-all"
                    >
                      <ShoppingCart size={18} />
                    </Link>
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
