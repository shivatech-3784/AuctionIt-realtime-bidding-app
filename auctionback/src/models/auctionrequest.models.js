import mongoose, { Schema } from "mongoose";

const auctionrequestschema = new Schema({
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
    requestedby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status : {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
},{timestamps: true});

const Auctionrequest = mongoose.model('AuctionRequest', auctionrequestschema);
export default Auctionrequest