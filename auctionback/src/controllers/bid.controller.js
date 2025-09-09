import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import Bid from '../models/bid.models.js';
import Auction from '../models/auction.models.js';



const placebid = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new apierror(400, "User should login first");

  const { auctionid, amount } = req.body;
  if (!auctionid || !amount) throw new apierror(400, "Auction ID and amount are required");

  const auction = await Auction.findById(auctionid);
  if (!auction || auction.status !== "active") throw new apierror(404, "Auction not found or not active");

  const now = new Date();
  if (now < new Date(auction.starttime) || (auction.endtime && now > new Date(auction.endtime))) {
    throw new apierror(400, "Auction is not live currently");
  }

  if (amount <= auction.baseprice) throw new apierror(400, "Bid amount must be greater than the base price");


  if (!auction.highestbid || amount > auction.highestbid.amount) {
    auction.highestbid = {
      amount,
      bidder: user._id,
    };
    await auction.save();
  }


  const newBid = await Bid.create({
    auction: auctionid,
    bidder: user._id,
    amount,
  });

  const populatedBid = await Bid.findById(newBid._id).populate("bidder", "username");


  req.io?.to(`auction_${auctionid}`).emit("newBid", {
    auctionId: auctionid,
    bid: {
      _id: populatedBid._id,
      bidder: {
        _id: populatedBid.bidder._id,
        username: populatedBid.bidder.username,
      },
      amount: populatedBid.amount,
    },
  });



  return res
    .status(200)
    .json(new apiresponse(200, populatedBid, "Bid placed successfully"));
});


const getallbidsofauction = asynchandler(async (req, res) => {
  const auctionId = req.params.auctionid;
  if (!auctionId) throw new apierror(400, "Auction ID is required");

  const bids = await Bid.find({ auction: auctionId })
    .populate("bidder", "username fullname avatar")
    .sort({ amount: -1 });

  return res
    .status(200)
    .json(new apiresponse(200, bids, "Bids retrieved successfully"));
});


const getallbidsbyme = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) throw new apierror(400, "User should login first");

  const bids = await Bid.find({ bidder: user._id })
    .populate("auction", "item baseprice starttime endtime status")
    .sort({ timestamp: -1 });

  if (!bids || bids.length === 0) {
    throw new apierror(404, "No bids found for this user");
  }

  return res
    .status(200)
    .json(new apiresponse(200, bids, "Bids by user retrieved successfully"));
});

const gethighestbidforauction = asynchandler(async (req, res) => {
  const auctionid = req.params.id;
  if (!auctionid) throw new apierror(400, "Auction ID is required");

  const auction = await Auction.findById(auctionid).populate("highestbid.bidder", "username fullname avatar");

  if (!auction || !auction.highestbid || !auction.highestbid.amount) {
    throw new apierror(404, "No highest bid found for this auction");
  }

  return res
    .status(200)
    .json(new apiresponse(200, auction.highestbid, "Highest bid retrieved successfully"));
});

export {
  placebid,
  getallbidsofauction,
  getallbidsbyme,
  gethighestbidforauction,
};
