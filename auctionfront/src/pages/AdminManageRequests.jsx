import React, { useEffect, useState, useContext } from "react";
import AxiosInstance from "../utils/ApiConfig.js";
import UserContext from "../context/UserContext.jsx";

const AdminManageAuctions = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingRequests = async () => {
    try {
      const res = await AxiosInstance.get("/admin/auctionrequests/pending");
      setRequests(res.data.data || []);
    } catch (err) {
      console.error("Error fetching auction requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const url = `/admin/auctionrequests/${action}/${id}`;
      await AxiosInstance.post(url);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(`${action} failed`, err);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchPendingRequests();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">Access Denied</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
        Manage Auction Requests
      </h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-600">
          No pending auction requests.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={req.imageUrl}
                alt={req.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">{req.name}</h2>
                <p className="text-gray-600 mt-1 text-sm">{req.description}</p>
                <p className="mt-2 text-yellow-700 font-semibold">
                  Base Price: ₹{req.baseprice}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Requested by: {req.requestedby?.username || "User"}
                </p>

                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => handleAction(req._id, "accept")}
                    className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-md"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminManageAuctions;
