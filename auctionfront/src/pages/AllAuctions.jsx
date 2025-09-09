import React, { useEffect, useState } from "react";
import AxiosInstance from "../utils/ApiConfig.js";
import AuctionCard from "../components/AuctionCard.jsx";

const AllAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await AxiosInstance.get("/auctions");
        setAuctions(res.data.data || []);
      } catch (err) {
        console.error(
          "Failed to fetch auctions:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Auctions</h1>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen bg-white">
          <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
        </div>
      ) : auctions.length === 0 ? (
        <p>No auctions found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllAuctions;
