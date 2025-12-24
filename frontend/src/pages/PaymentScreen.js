import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Agar address nahi bhara toh wapas shipping par bhejein
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState("Razorpay");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10">
      {/* Checkout Progress Bar */}
      <CheckoutSteps step1 step2 step3 />

      <div className="flex justify-center items-center mt-10">
        <form
          onSubmit={submitHandler}
          className="bg-[#1e293b] p-10 rounded-3xl border border-gray-800 w-full max-w-md shadow-2xl"
        >
          <h1 className="text-3xl font-black mb-10 text-blue-500 italic text-center">
            Select <span className="text-white">Method</span>
          </h1>

          <div className="space-y-4 mb-10">
            {/* Razorpay Option */}
            <div
              onClick={() => setPaymentMethod("Razorpay")}
              className={`p-5 rounded-2xl border-2 cursor-pointer flex items-center space-x-4 transition-all duration-300 ${
                paymentMethod === "Razorpay"
                  ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                  : "border-gray-700 bg-[#0f172a] hover:border-gray-500"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "Razorpay"
                    ? "border-blue-500"
                    : "border-gray-500"
                }`}
              >
                {paymentMethod === "Razorpay" && (
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <span className="font-bold text-lg">Razorpay</span>
              <span className="text-xs text-gray-400 ml-auto">
                (Cards, UPI, NetBanking)
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-4 rounded-2xl font-black text-white hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/20 uppercase tracking-widest"
          >
            Continue to Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;
