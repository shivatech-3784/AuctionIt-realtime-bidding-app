import React from "react";
import { Link } from "react-router-dom";

const AuctionCard = ({ auction }) => {
  return (
    <Link to={`/auctions/${auction._id}`} className="block">
      <div className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 h-96"> {/* Fixed height */}
        <img
          src={auction.imageUrl}
          alt={auction.name}
          className="h-32 w-full object-cover"
        />
        <div className="p-4 overflow-auto h-60 scrollbar-none"> 
          <h2 className="text-lg font-bold text-gray-800">{auction.name}</h2>
          <p className="text-gray-600 text-sm mt-1">{auction.description}</p>
          <p className="mt-2 text-yellow-700 font-semibold">
            Base Price: ₹{auction.baseprice}
          </p>
          <p className="text-xs text-gray-400 mt-1">Status: {auction.status}</p>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
