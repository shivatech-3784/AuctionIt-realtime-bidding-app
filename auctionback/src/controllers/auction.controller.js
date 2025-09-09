import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import Auction from "../models/auction.models.js";
import mongoose from "mongoose";


const getallactiveauctions = asynchandler(async (req, res) => {
  const activeauctions = await Auction.aggregate([
    { $match: { status: "active" } },
    {
      $lookup: {
        from: "users",
        localField: "createdby",
        foreignField: "_id",
        as: "createdby"
      }
    },
    {
      $sort: { starttime: -1 } 
    },
    { $unwind: "$createdby" },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        imageUrl: 1,
        baseprice: 1,
        starttime: 1,
        endtime: 1,
        status: 1,
        createdby: {
          _id: 1,
          username: 1,
          fullname: 1,
          avatar: 1
        }
      }
    },
  ]);
  // console.log("Active Auctions:", activeauctions);
  if (!activeauctions || activeauctions.length === 0) {
    throw new apierror(404, "No active auctions found");
  }

  return res
    .status(200)
    .json(new apiresponse(200, activeauctions, "Active auctions retrieved successfully"));
});


const getauctionbyid = asynchandler(async (req, res) => {
  const auctionId = req.params.id;

  if (!auctionId || !mongoose.Types.ObjectId.isValid(auctionId)) {
    throw new apierror(400, "Invalid or missing Auction ID");
  }

  const auction = await Auction.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(auctionId) } },
    {
      $lookup: {
        from: "users",
        localField: "createdby",
        foreignField: "_id",
        as: "createdby"
      }
    },
    { $unwind: "$createdby" },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        imageUrl: 1,
        baseprice: 1,
        starttime: 1,
        endtime: 1,
        status: 1,
        highestbid: 1,
        winner: 1,
        finalPrice:1,
        createdby: {
          _id: 1,
          username: 1,
          fullname: 1,
          avatar: 1
        }
      }
    }
  ]);

  if (!auction || auction.length === 0) {
    throw new apierror(404, "Auction not found");
  }

  return res
    .status(200)
    .json(new apiresponse(200, auction[0], "Auction retrieved successfully"));
});

const getallauctions = asynchandler(async (req, res) => {
  const auctions = await Auction.find({})
    .select("_id name description imageUrl baseprice starttime endtime status")
    .sort({ starttime: -1 }) 
    .lean();

  if (!auctions || auctions.length === 0) {
    return res
      .status(404)
      .json(new apiresponse(404, [], "No auctions found"));
  }

  return res
    .status(200)
    .json(new apiresponse(200, auctions, "All auctions retrieved successfully"));
});


const getallauctionsbyuser = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new apierror(400, "User should login first");
  }

  const auctions = await Auction.find({ createdby: user._id })
    .select("_id name description imageUrl baseprice starttime endtime status")
    .lean();

  if (!auctions || auctions.length === 0) {
    return res
      .status(404)
      .json(new apiresponse(404, [], "No auctions found for this user"));
  }

  return res
    .status(200)
    .json(new apiresponse(200, auctions, "User's auctions retrieved successfully"));
});

export {
  getallactiveauctions,
  getauctionbyid,
  getallauctionsbyuser,
  getallauctions
};
