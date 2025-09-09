import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaGavel,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import AxiosInstance from "../utils/ApiConfig";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await AxiosInstance.get("/admin/getstats");
        setStats(res.data.data);
      } catch (err) {
        console.error("Error fetching admin stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Users" value={stats.users} icon={<FaUsers />} />
        <StatCard
          title="Total Auctions"
          value={stats.auctions}
          icon={<FaGavel />}
        />
        <StatCard
          title="Active Auctions"
          value={stats.active}
          icon={<FaHourglassHalf />}
        />
        <StatCard
          title="Completed Auctions"
          value={stats.completed}
          icon={<FaCheckCircle />}
        />
      </div>

      
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Recent Auctions</h2>
        <div className="overflow-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Start</th>
                <th className="text-left px-4 py-2">End</th>
                <th className="text-left px-4 py-2">Final Price</th>
                <th className="text-left px-4 py-2">Winner</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentAuctions.map((auction) => (
                <tr key={auction._id} className="border-t">
                  <td className="px-4 py-2">{auction.name}</td>
                  <td className="px-4 py-2 capitalize">{auction.status}</td>
                  <td className="px-4 py-2">
                    {new Date(auction.starttime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(auction.endtime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">₹{auction.finalPrice}</td>
                  <td className="px-4 py-2">
                    {auction.winner?.username || "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        <div className="overflow-auto bg-white rounded shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Username</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Joined</th>
                <th className="text-left px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white shadow rounded-lg p-4 flex items-center space-x-4">
    <div className="text-blue-600 text-2xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
