import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

import userRouter from './routes/user.routes.js';
app.use("/api/v1/users", userRouter);

import auctionRequestRoutes from "./routes/auctionrequest.routes.js";
app.use("/api/v1/auctionrequests", auctionRequestRoutes);

import auctionRoutes from "./routes/auction.routes.js";
app.use("/api/v1/auctions", auctionRoutes);

import adminRoutes from "./routes/admin.routes.js";
app.use("/api/v1/admin", adminRoutes);

import bidRoutes from "./routes/bid.routes.js";
app.use("/api/v1/bid", bidRoutes);

import paymentRoutes from "./routes/payment.routes.js";
app.use("/api/v1/payment", paymentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statuscode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statuscode: statusCode,
    message,
    errors: err.errors || [],
    stack: err.stack || undefined
  });
});

export default app;
