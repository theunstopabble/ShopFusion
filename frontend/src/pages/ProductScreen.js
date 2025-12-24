import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1); // Quantity state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart"); // Item add hote hi cart page par le jayega
  };

  if (loading)
    return (
      <div className="text-center mt-20 font-bold">Loading Product...</div>
    );

  return (
    <div className="container mx-auto p-6">
      <Link
        to="/"
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded mb-6 inline-block transition"
      >
        &larr; Go Back
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mt-4">
        {/* Product Image */}
        <div className="rounded-xl overflow-hidden shadow-lg border">
          <img
            src={product.image}
            alt={product.name}
            className="w-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            {product.name}
          </h2>
          <div className="border-b pb-4 mb-4">
            <span className="text-2xl font-semibold text-blue-600">
              ${product.price}
            </span>
          </div>
          <p className="text-gray-600 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="bg-gray-50 p-6 rounded-lg border shadow-sm">
            <div className="flex justify-between mb-4">
              <span className="text-gray-700">Status:</span>
              <span
                className={
                  product.countInStock > 0
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }
              >
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-700">Quantity:</span>
                <select
                  className="border p-2 rounded bg-white outline-none focus:border-blue-500"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
            >
              Add to ShopFusion Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
