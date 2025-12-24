import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, CheckCircle, XCircle, ListOrdered } from "lucide-react";

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      const fetchOrders = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          };
          const { data } = await axios.get("/api/orders", config);
          setOrders(data);
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
      fetchOrders();
    } else {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  if (loading)
    return (
      <div className="text-center p-20 text-white italic">
        Loading All Orders...
      </div>
    );

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-6 md:p-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-black mb-10 flex items-center gap-3 italic tracking-tighter">
          <ListOrdered className="text-blue-500" /> All{" "}
          <span className="text-blue-500 underline decoration-white/10">
            Customer Orders
          </span>
        </h1>

        <div className="bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0f172a] text-gray-500 uppercase text-xs tracking-widest font-black">
              <tr>
                <th className="px-6 py-5">ORDER ID</th>
                <th className="px-6 py-5">USER</th>
                <th className="px-6 py-5 text-center">DATE</th>
                <th className="px-6 py-5 text-center">TOTAL</th>
                <th className="px-6 py-5 text-center">PAID</th>
                <th className="px-6 py-5 text-center">DELIVERED</th>
                <th className="px-6 py-5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-blue-600/5 transition-colors group text-sm"
                >
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 font-bold">
                    {order.user && order.user.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="px-6 py-4 text-center font-black text-blue-400">
                    ${order.totalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {order.isPaid ? (
                        <CheckCircle className="text-green-500" size={18} />
                      ) : (
                        <XCircle className="text-red-500" size={18} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {order.isDelivered ? (
                        <CheckCircle className="text-green-500" size={18} />
                      ) : (
                        <XCircle className="text-red-500" size={18} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="p-2 text-gray-400 hover:text-blue-500 rounded-lg"
                    >
                      <Eye size={18} />
                    </button>
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

export default OrderListScreen;
