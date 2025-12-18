import express from "express";
import { submitauctionrequest, getallrequestsbyme } from "../controllers/auctionrequest.controllers.js";

import {verifyjwt } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.post('/submit-request', upload.single("image"), verifyjwt, submitauctionrequest);

router.get("/my-requests", verifyjwt, getallrequestsbyme);

export default router;
