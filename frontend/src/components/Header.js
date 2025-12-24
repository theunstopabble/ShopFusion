import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  ChevronDown,
  LayoutDashboard,
  Search,
} from "lucide-react";
import { logout } from "../slices/userSlice";

const Header = () => {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = React.useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/?keyword=${keyword}`);
    else navigate("/");
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    // FIX 1: z-index ko badha kar 100 kiya aur dropdown visibility ke liye relative rakha
    <header className="bg-[#0f172a]/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-[100] transition-all">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-black text-white italic tracking-tighter hover:scale-105 transition-transform"
        >
          Shop<span className="text-blue-500">Fusion</span>
        </Link>

        {/* 🔍 Search Bar */}
        <form
          onSubmit={submitHandler}
          className="hidden md:flex items-center bg-[#1e293b] rounded-xl px-4 py-2 border border-gray-700 focus-within:border-blue-500 transition-all shadow-inner"
        >
          <input
            type="text"
            placeholder="Search premium gear..."
            className="bg-transparent outline-none text-sm text-white w-64"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit" className="text-gray-400 hover:text-blue-500">
            <Search size={18} />
          </button>
        </form>

        {/* Right Icons */}
        <div className="flex items-center space-x-6">
          <Link
            to="/cart"
            className="relative text-gray-400 hover:text-white transition-all hover:scale-110 active:scale-90"
          >
            <ShoppingCart size={24} />
          </Link>

          {userInfo ? (
            <div className="flex items-center space-x-4">
              {/* User Dropdown */}
              <div className="group relative">
                <button className="text-blue-400 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all">
                  Hi, {userInfo.name.split(" ")[0]}{" "}
                  <ChevronDown
                    size={14}
                    className="group-hover:rotate-180 transition-transform"
                  />
                </button>

                {/* FIX 2: Dropdown Layering (z-index 101) aur Glassmorphism effect */}
                <div className="absolute right-0 mt-2 w-52 bg-[#1e293b] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[101] backdrop-blur-xl">
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 rounded-xl hover:bg-white/5 text-white font-medium transition-colors"
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 font-bold transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Admin Menu */}
              {userInfo.isAdmin && (
                <div className="group relative">
                  <button className="bg-blue-600/10 text-blue-500 px-3 py-1.5 rounded-lg font-black border border-blue-500/20 flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all">
                    <LayoutDashboard size={18} /> Admin
                  </button>

                  {/* FIX 3: Admin Dropdown Layering */}
                  <div className="absolute right-0 mt-2 w-56 bg-[#1e293b] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[101] backdrop-blur-xl">
                    <div className="p-2 space-y-1">
                      <Link
                        to="/admin/userlist"
                        className="block px-4 py-3 rounded-xl hover:bg-white/5 text-white font-medium transition-colors"
                      >
                        Manage Users
                      </Link>
                      <Link
                        to="/admin/productlist"
                        className="block px-4 py-3 rounded-xl hover:bg-white/5 text-white font-medium transition-colors"
                      >
                        Manage Products
                      </Link>
                      <Link
                        to="/admin/orderlist"
                        className="block px-4 py-3 rounded-xl hover:bg-white/5 text-white font-medium transition-colors"
                      >
                        View Orders
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-gray-400 hover:text-white font-bold flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 transition-all"
            >
              <User size={20} /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
