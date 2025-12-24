import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // useLocation add kiya
import axios from "axios";
import { ShoppingCart, Star } from "lucide-react";

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search keyword nikalne ke liye logic
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Backend ko keyword bhej rahe hain
        const { data } = await axios.get(`/api/products?keyword=${keyword}`);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword]); // Jab bhi keyword badlega, products fir se fetch honge

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f172a]">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-blue-500 rounded-full"></div>
        </div>
      </div>
    );

  return (
    <div className="bg-[#0f172a] min-h-screen text-white pb-20">
      {/* Hero Section */}
      <div className="py-16 px-4 text-center bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
        <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">
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
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          {keyword
            ? `Showing results for "${keyword}"`
            : "Elevate your tech game with ShopFusion's exclusive gear."}
        </p>
      </div>

      <div className="container mx-auto px-6">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-[#1e293b]/30 rounded-3xl border border-dashed border-gray-700">
            <h3 className="text-2xl font-bold text-gray-500 italic">
              No products found matching your search.
            </h3>
            <Link to="/" className="text-blue-500 mt-4 block hover:underline">
              Clear Search
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-[#1e293b]/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-500 group shadow-2xl hover:shadow-blue-500/10"
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
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-white/20">
                    {product.brand}
                  </div>
                </Link>

                <div className="p-6">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-bold text-xl text-white mb-2 truncate hover:text-blue-400 transition-colors">
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
                    <Link
                      to={`/product/${product._id}`}
                      className="bg-blue-600 hover:bg-white hover:text-blue-600 p-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-90"
                    >
                      <ShoppingCart size={24} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
