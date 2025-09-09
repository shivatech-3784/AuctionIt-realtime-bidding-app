import express from "express";
import {
  getallactiveauctions,
  getauctionbyid,
  getallauctionsbyuser,
  getallauctions
} from "../controllers/auction.controller.js";
import { verifyjwt } from './../middleware/auth.middleware.js';

const router = express.Router();

router.get("/", getallauctions);

router.get("/active", getallactiveauctions);

router.get("/:id", getauctionbyid);

router.get("/my-auctions", verifyjwt, getallauctionsbyuser);

export default router;
