import mongoose, { Schema } from "mongoose";

const biddingschema = new Schema({
    auction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: [1, 'Bid amount must be greater than 0']
    },
},{timestamps: true});

 const Bid = mongoose.model('Bid', biddingschema);
 export default Bid