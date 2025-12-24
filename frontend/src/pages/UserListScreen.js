import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Trash2,
  ShieldCheck,
  ShieldAlert,
  User as UserIcon,
} from "lucide-react";

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.user);

  const fetchUsers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get("/api/users", config);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userInfo]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/users/${id}`, config);
        fetchUsers(); // Refresh list
      } catch (error) {
        alert(error.response.data.message);
      }
    }
  };

  if (loading)
    return <div className="text-center p-20 text-white">Loading Users...</div>;

  return (
    <div className="bg-[#0f172a] min-h-screen text-white p-6 md:p-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-black mb-10 flex items-center gap-3 italic">
          Manage{" "}
          <span className="text-blue-500 underline decoration-white/20">
            Users
          </span>
        </h1>

        <div className="bg-[#1e293b] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0f172a] text-gray-400 uppercase text-xs tracking-widest font-black">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Admin</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-600/5 transition-colors group"
                >
                  <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                    {user._id}
                  </td>
                  <td className="px-6 py-4 font-bold">{user.name}</td>
                  <td className="px-6 py-4 text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {user.isAdmin ? (
                        <ShieldCheck className="text-green-500" size={20} />
                      ) : (
                        <ShieldAlert
                          className="text-red-500 opacity-50"
                          size={20}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => deleteHandler(user._id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
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

export default UserListScreen;
