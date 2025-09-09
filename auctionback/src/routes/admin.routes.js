import express from "express";
import {
  viewallpendingrequests,
  acceptrequest,
  rejectrequest,
  closeauction,
  getAdminStats
} from "../controllers/admin.controller.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
import isadmin from "../middleware/admin.middleware.js";

const router = express.Router();


router.get("/auctionrequests/pending", verifyjwt, isadmin, viewallpendingrequests);


router.get("/getstats", verifyjwt, isadmin, getAdminStats);


router.post("/auctionrequests/accept/:id", verifyjwt, isadmin, acceptrequest);


router.post("/auctionrequests/reject/:id", verifyjwt, isadmin, rejectrequest);


router.post("/auctions/close/:id", verifyjwt, isadmin, closeauction);

export default router;
