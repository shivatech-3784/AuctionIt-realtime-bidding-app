import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import Auctionrequest from '../models/auctionrequest.models.js';
import { uploadToCloudinary } from "../utils/cloudinary.js";

const submitauctionrequest = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new apierror(400, "User should login first");
  }

  const { name, description, baseprice } = req.body;

  if (!name || !description || !baseprice) {
    throw new apierror(400, "Name, description, and base price are required");
  }

  
  if (!req.file || !req.file.path) {
    throw new apierror(400, "Image file is required");
  }

  
  const cloudinaryResult = await uploadToCloudinary(req.file.path);
  if (!cloudinaryResult || !cloudinaryResult.secure_url) {
    throw new apierror(500, "Failed to upload image to Cloudinary");
  }

  const auctionrequest = await Auctionrequest.create({
    name,
    description,
    baseprice,
    imageUrl: cloudinaryResult.secure_url,
    requestedby: user._id,
  });

  if (!auctionrequest) {
    throw new apierror(500, "Failed to create auction request");
  }

  return res
    .status(200)
    .json(new apiresponse(200, auctionrequest, "Auction request created successfully"));
});




const getallrequestsbyme = asynchandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new apierror(400, "User should login first");
  }

  const auctionreqbyme = await Auctionrequest.find({ requestedby: user._id })
    .select("name description baseprice imageUrl status createdAt")
    .sort({ createdAt: -1 });

  if (!auctionreqbyme || auctionreqbyme.length === 0) {
    return res
      .status(404)
      .json(new apiresponse(404, [], "No requests found"));
  }

  return res
    .status(200)
    .json(new apiresponse(200, auctionreqbyme, "Requests retrieved successfully"));
});

export {
    getallrequestsbyme,
    submitauctionrequest
}