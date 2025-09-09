import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import Auctionrequest from "../models/auctionrequest.models.js";
import Auction from "../models/auction.models.js";
import User from "../models/user.models.js";


const viewallpendingrequests = asynchandler(async (req, res) => {
  const pendingRequests = await Auctionrequest.find({ status: "pending" })
    .populate("requestedby", "username fullname avatar")
    .sort({ createdAt: -1 })
    .lean();

  if (!pendingRequests || pendingRequests.length === 0) {
    throw new apierror(404, "No pending requests found");
  }

  return res
    .status(200)
    .json(new apiresponse(200, pendingRequests, "Pending requests retrieved successfully"));
});


const acceptrequest = asynchandler(async (req, res) => {
  const requestId = req.params.id;
  if (!requestId) {
    throw new apierror(400, "Request ID is required");
  }

  const request = await Auctionrequest.findById(requestId);
  if (!request) {
    throw new apierror(404, "Request not found");
  }

  if (request.status !== "pending") {
    throw new apierror(400, "Request is already accepted or rejected");
  }

  request.status = "accepted";
  await request.save();

  const auction = await Auction.create({
    createdby: request.requestedby,
    baseprice: request.baseprice,
    name: request.name,
    description: request.description,
    imageUrl: request.imageUrl,
    starttime: new Date(),
    endtime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "active",
  });

  return res
    .status(200)
    .json(new apiresponse(200, { request, auction }, "Request accepted and auction created successfully"));
});

const rejectrequest = asynchandler(async (req, res) => {
  const requestId = req.params.id;
  if (!requestId) {
    throw new apierror(400, "Request ID is required");
  }

  const request = await Auctionrequest.findById(requestId).populate(
    "requestedby",
    "username fullname avatar"
  );

  if (!request) {
    throw new apierror(404, "Request not found");
  }

  if (request.status !== "pending") {
    throw new apierror(400, "Request is already accepted or rejected");
  }

  request.status = "rejected";
  await request.save();

  return res
    .status(200)
    .json(new apiresponse(200, request, "Request rejected successfully"));
});

const getAdminStats = asynchandler(async (req, res) => {
  const users = await User.find().select("-password -refreshtoken").sort({ createdAt: -1 });
  const auctions = await Auction.find().sort({ createdAt: -1 }).populate('winner', 'username');

  const stats = {
    users: users.length,
    auctions: auctions.length,
    active: auctions.filter(a => a.status === "active").length,
    completed: auctions.filter(a => a.status === "ended").length,
    recentUsers: users.slice(0, 5),
    recentAuctions: auctions.slice(0, 5),
  };

  return res.status(200).json(new apiresponse(200, stats, "Admin stats fetched"));
});



const closeauction = asynchandler(async (req, res) => {
  const auctionId = req.params.id;
  if (!auctionId) {
    throw new apierror(400, "Auction ID is required");
  }

  const auction = await Auction.findById(auctionId);
  if (!auction) {
    throw new apierror(404, "Auction not found");
  }

  if (auction.status !== "active") {
    throw new apierror(400, "Auction is not active");
  }

  auction.status = "ended";  
  auction.endtime = new Date();
  await auction.save();

  return res
    .status(200)
    .json(new apiresponse(200, auction, "Auction closed successfully"));
});

export {
  viewallpendingrequests,
  acceptrequest,
  rejectrequest,
  closeauction,
  getAdminStats
};
