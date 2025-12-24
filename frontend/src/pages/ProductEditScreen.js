import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  Layers,
  Info,
  Upload, // Naya icon add kiya
} from "lucide-react";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); // Uploading state

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  // 🚀 Image Upload Logic
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data); // Backend se mila path state mein set karein
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Image upload failed");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(
        `/api/products/${productId}`,
        { name, price, image, brand, category, countInStock, description },
        config
      );
      navigate("/admin/productlist");
    } catch (error) {
      alert(
        "Update Failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  if (loading)
    return (
      <div className="text-center p-20 text-white italic">
        Loading Product Data...
      </div>
    );

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-6 md:p-12">
      <div className="container mx-auto max-w-4xl">
        <Link
          to="/admin/productlist"
          className="flex items-center gap-2 text-gray-400 hover:text-blue-500 mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Products
        </Link>

        <form
          onSubmit={submitHandler}
          className="bg-[#1e293b] p-8 md:p-12 rounded-[2.5rem] border border-gray-800 shadow-2xl"
        >
          <h1 className="text-3xl font-black mb-10 text-blue-500 italic tracking-tighter flex items-center gap-3">
            <Package size={32} /> Edit{" "}
            <span className="text-white">Product Details</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">
                Product Name
              </label>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0f172a] p-4 rounded-2xl border border-gray-700 outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">
                Price ($)
              </label>
              <div className="relative">
                <DollarSign
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#0f172a] pl-12 pr-4 py-4 rounded-2xl border border-gray-700 outline-none focus:border-blue-500 transition-all font-bold"
                />
              </div>
            </div>

            {/* 📁 Upload Image Section */}
            <div className="space-y-2 col-span-full">
              <label className="text-sm font-bold text-gray-400 ml-1">
                Product Image
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="/images/product.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 bg-[#0f172a] p-4 rounded-2xl border border-gray-700 outline-none focus:border-blue-500 transition-all font-mono text-sm"
                />
                <div className="relative">
                  <input
                    type="file"
                    id="image-file"
                    className="hidden"
                    onChange={uploadFileHandler}
                  />
                  <label
                    htmlFor="image-file"
                    className="cursor-pointer bg-blue-600/10 border border-blue-500/20 text-blue-500 px-6 py-4 rounded-2xl flex items-center gap-2 font-black hover:bg-blue-600 hover:text-white transition-all whitespace-nowrap"
                  >
                    <Upload size={18} />{" "}
                    {uploading ? "Uploading..." : "Upload File"}
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">
                Brand
              </label>
              <input
                type="text"
                placeholder="Brand name"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#0f172a] p-4 rounded-2xl border border-gray-700 outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1 flex items-center gap-1">
                <Layers size={14} /> Category
              </label>
              <input
                type="text"
                placeholder="e.g. Electronics"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0f172a] p-4 rounded-2xl border border-gray-700 outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">
                Count In Stock
              </label>
              <input
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="w-full bg-[#0f172a] p-4 rounded-2xl border border-gray-700 outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>

            <div className="space-y-2 col-span-full">
              <label className="text-sm font-bold text-gray-400 ml-1 flex items-center gap-1">
                <Info size={14} /> Description
              </label>
              <textarea
                rows="4"
                placeholder="Describe the product..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0f172a] p-4 rounded-2xl border border-gray-700 outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-5 rounded-2xl mt-12 font-black text-white hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <Save size={20} /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditScreen;
