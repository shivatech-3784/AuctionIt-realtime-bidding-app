import express from "express";
import {
  placebid,
  getallbidsofauction,
  getallbidsbyme,
  gethighestbidforauction
} from "../controllers/bid.controller.js";
import { verifyjwt } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/place", verifyjwt, placebid);

router.get("/:auctionid", getallbidsofauction);


router.get("/my", verifyjwt, getallbidsbyme);


router.get("/highest/:id", gethighestbidforauction);

export default router;
