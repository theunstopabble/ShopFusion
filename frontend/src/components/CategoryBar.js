import React from "react";
import { useNavigate } from "react-router-dom";
import { Laptop, Smartphone, Watch, Headphones, Tv, Zap } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { name: "All", icon: <Zap size={18} />, path: "/" },
  {
    name: "Electronics",
    icon: <Laptop size={18} />,
    path: "/?keyword=Electronics",
  },
  { name: "Mobiles", icon: <Smartphone size={18} />, path: "/?keyword=Mobile" },
  { name: "Audio", icon: <Headphones size={18} />, path: "/?keyword=Audio" },
  { name: "Watches", icon: <Watch size={18} />, path: "/?keyword=Watch" },
  { name: "Home Tech", icon: <Tv size={18} />, path: "/?keyword=TV" },
];

const CategoryBar = () => {
  const navigate = useNavigate();

  return (
    /* Gap Fix: py-4 ko py-2 kiya aur top-16 ko ensure kiya ki Navbar ke niche fit ho */
    <div className="bg-[#1e293b]/90 backdrop-blur-md border-b border-white/5 py-2 overflow-x-auto no-scrollbar sticky top-[64px] z-50 transition-all">
      <div className="container mx-auto px-6 flex justify-start md:justify-center space-x-10">
        {categories.map((item, index) => (
          <motion.div
            key={item.name}
            whileHover={{ scale: 1.1, color: "#3b82f6" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center cursor-pointer min-w-max text-gray-400 hover:text-white transition-all group"
          >
            <div className="mb-1 p-2 bg-slate-800/50 rounded-xl group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
              {item.icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {item.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
