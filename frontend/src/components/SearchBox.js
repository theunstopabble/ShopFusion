import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBox = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex items-center bg-[#1e293b] rounded-xl px-4 py-2 border border-gray-700 focus-within:border-blue-500 transition-all"
    >
      <input
        type="text"
        placeholder="Search products..."
        className="bg-transparent outline-none text-sm text-white w-40 md:w-64"
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button type="submit" className="text-gray-400 hover:text-blue-500">
        <Search size={18} />
      </button>
    </form>
  );
};

export default SearchBox;
