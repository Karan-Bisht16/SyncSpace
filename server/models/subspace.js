import mongoose from "mongoose";

const subspace_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    members: [{
        type: mongoose.Schema.Types.Mixed,
        ref: "User",
    }],
    membersCount: {
        type: Number,
        default: 1,
    },
    moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
});

const Subspace = mongoose.model("Subspace", subspace_Schema);
export default Subspace;