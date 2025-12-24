import React, { useEffect, useState, useCallback } from "react"; // useCallback add kiya
import { useParams } from "react-router-dom"; // Link hata diya
import axios from "axios";
import { useSelector } from "react-redux";
import { CreditCard, Truck } from "lucide-react"; // Unused icons hata diye

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { userInfo } = useSelector((state) => state.user);

  // fetchOrder ko useCallback mein wrap kiya taaki useEffect warning na de
  const fetchOrder = useCallback(async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`/api/orders/${orderId}`, config);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, [orderId, userInfo.token]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]); // Ab fetchOrder stable dependency hai

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) return alert("Razorpay SDK failed to load.");

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data: keyId } = await axios.get("/api/config/razorpay");
      const { data: rzpOrder } = await axios.post(
        `/api/orders/${orderId}/razorpay`,
        {},
        config
      );

      const options = {
        key: keyId,
        amount: rzpOrder.amount,
        currency: "INR",
        name: "ShopFusion",
        order_id: rzpOrder.id,
        handler: async (response) => {
          const paymentResult = {
            id: response.razorpay_payment_id,
            status: "Paid",
            email_address: userInfo.email,
          };
          await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);
          fetchOrder();
        },
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: "#3b82f6" },
      };
      new window.Razorpay(options).open();
    } catch (error) {
      console.error(error);
    }
  };

  const deliverHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/orders/${orderId}/deliver`, {}, config);
      fetchOrder();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-white text-center italic uppercase tracking-widest animate-pulse">
        Fetching Order Details...
      </div>
    );
  if (!order)
    return <div className="p-10 text-white text-center">Order not found.</div>;

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-6 md:p-12">
      <div className="container mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-gray-800 shadow-xl">
            <h2 className="text-xl font-bold text-blue-500 mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <Truck size={22} /> Shipping Info
            </h2>
            <p className="text-gray-300">
              <strong>Name:</strong> {order.user.name}
            </p>
            <p className="text-gray-300">
              <strong>Address:</strong> {order.shippingAddress.address},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.country}
            </p>
            <div
              className={`mt-4 p-3 rounded-xl font-black text-center ${
                order.isDelivered
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {order.isDelivered
                ? `Delivered on ${new Date(order.deliveredAt).toLocaleString()}`
                : "Awaiting Delivery"}
            </div>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-3xl border border-gray-800 shadow-xl">
            <h2 className="text-xl font-bold text-blue-500 mb-4 flex items-center gap-2 uppercase tracking-tighter">
              <CreditCard size={22} /> Payment
            </h2>
            <div
              className={`mt-4 p-3 rounded-xl font-black text-center ${
                order.isPaid
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {order.isPaid
                ? `Paid on ${new Date(order.paidAt).toLocaleString()}`
                : "Payment Pending"}
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] p-8 rounded-3xl border border-blue-500/30 h-fit shadow-2xl sticky top-24">
          <h2 className="text-2xl font-black mb-6 border-b border-gray-800 pb-4 uppercase tracking-tighter text-center">
            Summary
          </h2>
          <div className="space-y-4 text-white text-2xl font-black border-t border-gray-700 pt-6 flex justify-between">
            <span>Total</span>
            <span className="text-blue-500">${order.totalPrice}</span>
          </div>

          {!order.isPaid && (
            <button
              onClick={handlePayment}
              className="w-full bg-blue-600 hover:bg-white hover:text-blue-600 text-white py-5 rounded-2xl mt-10 font-black transition-all shadow-lg uppercase tracking-widest"
            >
              Pay with Razorpay
            </button>
          )}

          {userInfo &&
            userInfo.isAdmin &&
            order.isPaid &&
            !order.isDelivered && (
              <button
                onClick={deliverHandler}
                className="w-full bg-green-600 hover:bg-white hover:text-green-600 text-white py-5 rounded-2xl mt-4 font-black transition-all shadow-lg uppercase tracking-widest"
              >
                Mark As Delivered
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
