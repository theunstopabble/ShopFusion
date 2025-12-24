import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    // Ye line sabse important hai.
    // Agar user logged in nahi hai, toh ye URL user ko login par bhejega
    // aur login hone ke baad wapas '/shipping' par laayega.
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-4 md:p-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-black mb-10 flex items-center gap-3">
          <ShoppingBag className="text-blue-500" /> Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-[#1e293b] p-10 rounded-3xl text-center border border-dashed border-gray-700">
            <h2 className="text-xl text-gray-400 mb-6">Your cart is empty</h2>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-bold transition-all inline-block"
            >
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {/* Left Side: Cart Items List */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-[#1e293b] p-4 md:p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center gap-6 group hover:border-blue-500/30 transition-all shadow-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />

                  <div className="flex-grow text-center md:text-left">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-bold hover:text-blue-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">
                      {item.brand}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center bg-[#0f172a] rounded-xl border border-gray-700 overflow-hidden">
                    <button
                      className="p-3 hover:bg-gray-800 transition-colors"
                      onClick={() =>
                        addToCartHandler(item, Math.max(1, item.qty - 1))
                      }
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 font-bold text-blue-500">
                      {item.qty}
                    </span>
                    <button
                      className="p-3 hover:bg-gray-800 transition-colors"
                      onClick={() =>
                        addToCartHandler(
                          item,
                          Math.min(item.countInStock, item.qty + 1)
                        )
                      }
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-xl font-black text-white">
                    ${(item.price * item.qty).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="text-gray-500 hover:text-red-500 p-2 transition-colors"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>

            {/* Right Side: Order Summary Card */}
            <div className="bg-[#1e293b] p-8 rounded-3xl border border-blue-500/20 h-fit shadow-2xl sticky top-24">
              <h2 className="text-2xl font-black mb-6 border-b border-gray-800 pb-4 uppercase tracking-tighter">
                Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Total Items:</span>
                  <span className="text-white font-bold">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-black pt-4 border-t border-gray-800">
                  <span>Total Price:</span>
                  <span className="text-blue-500">
                    $
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full bg-blue-600 hover:bg-white hover:text-blue-600 text-white py-4 rounded-2xl font-black transition-all duration-300 shadow-lg shadow-blue-500/20 disabled:bg-gray-700 disabled:cursor-not-allowed uppercase tracking-widest"
                disabled={cartItems.length === 0}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
