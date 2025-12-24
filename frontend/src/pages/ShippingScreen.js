import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const userLogin = useSelector((state) => state.user);
  const { userInfo } = userLogin;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <CheckoutSteps step1 step2 />
      <div className="flex justify-center items-center">
        <form
          onSubmit={submitHandler}
          className="bg-[#1e293b] p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-800"
        >
          <h1 className="text-3xl font-black mb-8 text-blue-500 italic">
            Shipping Details
          </h1>
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Address"
              className="w-full bg-[#0f172a] border border-gray-700 p-4 rounded-xl outline-none"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City"
                className="w-full bg-[#0f172a] border border-gray-700 p-4 rounded-xl outline-none"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                className="w-full bg-[#0f172a] border border-gray-700 p-4 rounded-xl outline-none"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <input
              type="text"
              placeholder="Country"
              className="w-full bg-[#0f172a] border border-gray-700 p-4 rounded-xl outline-none"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-white hover:text-blue-600 py-4 rounded-2xl mt-10 font-black transition-all"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;
