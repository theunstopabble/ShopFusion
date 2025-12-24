import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCredentials } from "../slices/userSlice";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // URL se check karega ki redirect kahan karna hai (Default: '/')
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect); // Home ki jagah redirect path par bhejega
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      dispatch(setCredentials({ ...data }));
      // Login success ke baad redirect path par bhej do
      navigate(redirect);
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-[#0f172a]">
      <form
        onSubmit={submitHandler}
        className="bg-[#1e293b] p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800"
      >
        <h1 className="text-3xl font-black mb-8 text-center text-white italic">
          Shop<span className="text-blue-500">Fusion</span> Sign In
        </h1>

        <div className="mb-6">
          <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full bg-[#0f172a] border border-gray-700 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-gray-400 text-sm font-bold mb-2 uppercase tracking-widest">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full bg-[#0f172a] border border-gray-700 p-4 rounded-xl text-white focus:border-blue-500 outline-none transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/20"
        >
          Sign In
        </button>

        <p className="mt-6 text-center text-gray-400 font-medium">
          New Customer?{" "}
          <Link
            to={`/register?redirect=${redirect}`}
            className="text-blue-500 font-black hover:underline ml-1"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginScreen;
