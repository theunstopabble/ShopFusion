import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  ChevronDown,
  LayoutDashboard,
  Search,
} from "lucide-react"; // LogOut yahan se hata diya
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
    <header className="bg-[#0f172a] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black text-white italic">
          Shop<span className="text-blue-500">Fusion</span>
        </Link>

        {/* 🔍 Search Bar */}
        <form
          onSubmit={submitHandler}
          className="hidden md:flex items-center bg-[#1e293b] rounded-xl px-4 py-2 border border-gray-700 focus-within:border-blue-500 transition-all"
        >
          <input
            type="text"
            placeholder="Search products..."
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
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ShoppingCart size={24} />
          </Link>

          {userInfo ? (
            <div className="flex items-center space-x-4">
              {/* User Dropdown */}
              <div className="group relative">
                <button className="text-blue-400 font-bold flex items-center gap-2">
                  Hi, {userInfo.name.split(" ")[0]} <ChevronDown size={16} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link
                    to="/profile"
                    className="block px-4 py-3 hover:bg-gray-800 text-white"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-500 font-bold"
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Admin Menu */}
              {userInfo.isAdmin && (
                <div className="group relative">
                  <button className="bg-blue-600/10 text-blue-500 px-3 py-1.5 rounded-lg font-black border border-blue-500/20 flex items-center gap-2">
                    <LayoutDashboard size={18} /> Admin
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link
                      to="/admin/userlist"
                      className="block px-4 py-3 hover:bg-gray-800 text-white"
                    >
                      Manage Users
                    </Link>
                    <Link
                      to="/admin/productlist"
                      className="block px-4 py-3 hover:bg-gray-800 text-white"
                    >
                      Manage Products
                    </Link>
                    <Link
                      to="/admin/orderlist"
                      className="block px-4 py-3 hover:bg-gray-800 text-white"
                    >
                      View Orders
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-gray-400 hover:text-white font-bold flex items-center gap-2"
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
