import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../utils/ApiConfig";
import UserContext from "../context/UserContext";

const MyAuctionRequests = () => {
  const { user,userLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/signin");
    }

    const fetchMyRequests = async () => {
      try {
        const res = await AxiosInstance.get("/auctionrequests/my-requests");
        setRequests(res.data.data);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRequests();
  }, [user, userLoading,navigate]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Auction Requests</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center text-gray-600">
          You haven’t submitted any requests yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white shadow-md border rounded-lg p-4 space-y-3"
            >
              <img
                src={req.imageUrl}
                alt={req.itemName}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h2 className="text-xl font-bold text-gray-800">
                {req.itemName}
              </h2>
              <p className="text-gray-600">{req.description}</p>
              <p>
                <span className="font-semibold">Base Price:</span> ₹
                {req.baseprice}
              </p>
              <p>
                <span className="font-semibold">Category:</span> {req.category}
              </p>
              <p className="text-sm text-gray-500">
                Submitted on: {new Date(req.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded-md text-sm font-medium ${
                    req.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : req.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {req.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAuctionRequests;
