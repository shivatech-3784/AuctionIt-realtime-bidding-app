
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import dotenv from 'dotenv';
import Bid from './models/bid.models.js';
import Auction from './models/auction.models.js';
import {connectDB} from './db/index.js';
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const auctionTimers = {}; 

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_auction', (auctionId) => {
    socket.join(auctionId);
    console.log(`User ${socket.id} joined room ${auctionId}`);
  });

  socket.on('place_bid', async ({ amount, userId, auctionId }) => {
    try {
      const newBid = await Bid.create({
        amount,
        bidder: userId,
        auction: auctionId,
      });

      const updatedBids = await Bid.find({ auction: auctionId })
        .sort({ createdAt: -1 })
        .populate('bidder', 'username');

      const endTime = Date.now() + 2 * 60 * 1000;


      if (auctionTimers[auctionId]?.timeout) {
        clearTimeout(auctionTimers[auctionId].timeout);
      }


      const timeout = setTimeout(async () => {
        const finalBids = await Bid.find({ auction: auctionId })
          .sort({ createdAt: -1 })
          .populate('bidder');

        const winnerBid = finalBids[0];

        if (winnerBid) {
          await Auction.findByIdAndUpdate(auctionId, {
            status: 'ended',
            winner: winnerBid.bidder._id,
            finalPrice: winnerBid.amount,
          });

          io.to(auctionId).emit('auction_ended', {
            winner: winnerBid.bidder.username,
            amount: winnerBid.amount,
          });
        }
      }, 2 * 60 * 1000);

      auctionTimers[auctionId] = {
        endTime,
        timeout,
      };

      io.to(auctionId).emit('bid_update', {
        bids: updatedBids,
        endTime,
      });
    } catch (err) {
      console.error('Error placing bid:', err);
    }
  });
});

connectDB()
  .then(() => {
    console.log('Database connected successfully');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });
export { io }; 
export default server;
