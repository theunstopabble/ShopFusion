import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Plus, Edit, Trash2, Package } from "lucide-react";

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sirf Admin hi is page ko dekh sakta hai
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    } else {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts(); // Refresh list after delete
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      }
    }
  };

  const createProductHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post("/api/products", {}, config);
      navigate(`/admin/product/${data._id}/edit`); // Redirect to edit the new sample product
    } catch (error) {
      alert("Failed to create product");
    }
  };

  if (loading)
    return (
      <div className="text-center p-20 text-white italic">
        Loading Inventory...
      </div>
    );

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-6 md:p-12">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black flex items-center gap-3 italic tracking-tighter uppercase">
            <Package className="text-blue-500" /> Inventory{" "}
            <span className="text-blue-500 underline decoration-white/10">
              Control
            </span>
          </h1>
          <button
            onClick={createProductHandler}
            className="bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 uppercase text-xs tracking-widest"
          >
            <Plus size={18} /> Create New Product
          </button>
        </div>

        <div className="bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0f172a] text-gray-500 uppercase text-xs tracking-widest font-black border-b border-gray-800">
              <tr>
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Name</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-blue-600/5 transition-colors group"
                >
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {product._id}
                  </td>
                  <td className="px-6 py-4 font-bold">{product.name}</td>
                  <td className="px-6 py-4 font-black text-blue-400">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 text-gray-400 italic text-sm">
                    {product.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/product/${product._id}/edit`)
                        }
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductListScreen;
