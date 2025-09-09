import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import socket from "../utils/socket";
import UserContext from "../context/UserContext";
import AxiosInstance from "../utils/ApiConfig";

const stripePromise = loadStripe(import.meta.env.VITE_PUBLISHABLE_KEY);

const AuctionPage = () => {
  const navigate = useNavigate();
  const { auctionId } = useParams();
  const { user, userLoading } = useContext(UserContext);

  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [highlightedBidId, setHighlightedBidId] = useState(null);
  const [auctionDetails, setAuctionDetails] = useState(null);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [statusChecked, setStatusChecked] = useState(false);
  const [showRedirectingMessage, setShowRedirectingMessage] = useState(false); // NEW

  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/signin");
    }
  }, [user, userLoading, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    socket.emit("join_auction", auctionId);

    const fetchBids = async () => {
      try {
        const res = await AxiosInstance.get(`/bid/${auctionId}`);
        setBids(res.data.data);
      } catch (err) {
        console.error("Error fetching bids:", err);
      }
    };

    const fetchAuctionDetails = async () => {
      try {
        const res = await AxiosInstance.get(`/auctions/${auctionId}`);
        const details = res.data.data;
        setAuctionDetails(details);
        if (details.status !== "active") {
          setAuctionEnded(true);
          if (details.winner && details.finalPrice) {
            try {
              const winnerRes = await AxiosInstance.get(
                `/users/${details.winner}`
              );
              const winnerUsername = winnerRes.data.data?.username || "Unknown";
              setWinnerInfo({
                winner: winnerUsername,
                amount: details.finalPrice,
              });
            } catch (err) {
              console.error("Error fetching winner username:", err);
              setWinnerInfo({
                winner: "Unknown",
                amount: details.finalPrice,
              });
            }
          }
        }
        setStatusChecked(true);
      } catch (err) {
        console.error("Error fetching auction details:", err);
      }
    };

    fetchBids();
    fetchAuctionDetails();

    socket.on("bid_update", ({ bids, endTime }) => {
      setBids(bids);
      const now = Date.now();
      const remaining = Math.floor((endTime - now) / 1000);
      setTimeLeft(remaining);
      if (bids.length > 0) {
        setHighlightedBidId(bids[0]._id);
        setTimeout(() => setHighlightedBidId(null), 1500);
      }
    });

    socket.on("auction_ended", async ({ winner, amount }) => {
      setAuctionEnded(true);
      setWinnerInfo({ winner, amount });

      if (winner === user.username) {
        setShowRedirectingMessage(true); // Show message before redirect

        setTimeout(async () => {
          try {
            const res = await AxiosInstance.post(
              "/payment/create-checkout-session",
              {
                itemName: auctionDetails?.name || "Auction Item",
                amount,
              }
            );

            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId: res.data.sessionId });
          } catch (err) {
            console.error("Payment redirect failed:", err);
          }
        }, 3000);
      }
    });

    return () => {
      socket.off("bid_update");
      socket.off("auction_ended");
    };
  }, [auctionId]);

  const getHighestBid = () => (bids.length === 0 ? 0 : bids[0].amount);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    const highestBid = getHighestBid() || auctionDetails?.baseprice || 0;
    const parsedAmount = parseInt(bidAmount);
    if (
      !parsedAmount ||
      parsedAmount < highestBid + 100 ||
      parsedAmount % 100 !== 0
    ) {
      alert(
        "Invalid bid. Must be in ₹100 increments and higher than current bid."
      );
      return;
    }

    socket.emit("place_bid", {
      amount: parsedAmount,
      userId: user._id,
      auctionId,
    });

    setBidAmount("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  if (!statusChecked)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-2xl font-semibold mb-4">Auction Details</h2>
        {auctionDetails ? (
          <div>
            <img
              src={auctionDetails?.imageUrl}
              alt="Auction Item"
              className="w-full h-64 object-cover rounded mb-4"
            />
            <p>
              <strong>Item:</strong> {auctionDetails?.name}
            </p>
            <p>
              <strong>Description:</strong> {auctionDetails?.description}
            </p>
            <p>
              <strong>Base Price:</strong> ₹{auctionDetails?.baseprice}
            </p>
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Live Bidding</h2>
          <div className="bg-black text-white px-4 py-2 rounded-md text-lg font-mono">
            ⏳ {formatTime(timeLeft)}
          </div>
        </div>

        {auctionEnded ? (
          winnerInfo?.winner === user.username ? (
            <div className="text-center text-xl font-bold text-green-600">
              Congratulations {user.username}! You won the auction at ₹
              {winnerInfo.amount}!
              {showRedirectingMessage && (
                <p className="mt-2 text-yellow-600 font-medium animate-pulse">
                  You are being redirected to the payment page...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center text-xl font-bold text-red-500">
              Auction Ended! Winner: {winnerInfo?.winner} (₹{winnerInfo?.amount})
            </div>
          )
        ) : (
          <>
            <form onSubmit={handleBidSubmit} className="flex mb-4">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid"
                className="border border-gray-300 rounded-l px-4 py-2 w-full focus:outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700"
              >
                Submit Bid
              </button>
            </form>

            <h3 className="text-xl font-semibold mb-3">Bid History</h3>
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {bids.map((bid) => (
                <li
                  key={bid._id}
                  className={`py-2 px-3 flex justify-between transition-all duration-300 ${
                    bid._id === highlightedBidId
                      ? "bg-yellow-100 scale-[1.02]"
                      : ""
                  }`}
                >
                  <span>₹{bid.amount}</span>
                  <span className="text-gray-500">
                    by {bid.bidder?.username}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default AuctionPage;
