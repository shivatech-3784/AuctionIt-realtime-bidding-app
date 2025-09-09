import mongoose, { Schema } from "mongoose";

const auctionschema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    baseprice: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
    },
    createdby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    starttime: {
        type: Date,
        required: true
    },
    endtime: {
        type: Date,
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    finalPrice: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'ended', 'cancelled'],
        default: 'active'
    }
},{timestamps: true});

const Auction = mongoose.model('Auction', auctionschema);
export default Auction