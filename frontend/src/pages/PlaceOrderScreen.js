import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import CheckoutSteps from "../components/CheckoutSteps";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems, shippingAddress, paymentMethod } = cart;
  const { userInfo } = useSelector((state) => state.user);

  const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);
  const itemsPrice = addDecimals(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(itemsPrice > 500 ? 0 : 50);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  useEffect(() => {
    if (!paymentMethod) navigate("/payment");
  }, [paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config
      );
      dispatch(clearCartItems());
      navigate(`/order/${data._id}`);
    } catch (err) {
      alert(err.response?.data.message || err.message);
    }
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-6 md:p-12">
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="container mx-auto grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-2 text-blue-500 uppercase">
              Shipping Address
            </h2>
            <p>
              {shippingAddress.address}, {shippingAddress.city},{" "}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-2 text-blue-500 uppercase">
              Order Items
            </h2>
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-700 py-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <Link
                    to={`/product/${item._id}`}
                    className="hover:text-blue-400"
                  >
                    {item.name}
                  </Link>
                </div>
                <span>
                  {item.qty} x ${item.price} ={" "}
                  <strong>${(item.qty * item.price).toFixed(2)}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[#1e293b] p-8 rounded-3xl border border-blue-500/30 h-fit">
          <h2 className="text-2xl font-black mb-6 border-b border-gray-700 pb-4 text-center">
            Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-400">
              <span>Items</span>
              <span>${itemsPrice}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>${shippingPrice}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax</span>
              <span>${taxPrice}</span>
            </div>
            <div className="flex justify-between text-white text-2xl font-black border-t border-gray-700 pt-4">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
          <button
            onClick={placeOrderHandler}
            className="w-full bg-blue-600 py-4 rounded-2xl mt-8 font-black hover:bg-white hover:text-blue-600 transition-all shadow-lg"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
