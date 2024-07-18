import mongoose from "mongoose";

const condenseSubspaceSchema = mongoose.Schema({
    subspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Subspace" },
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    avatar: { type: String },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String },
    dateJoined: { type: Date, default: Date.now },
    credits: { type: Number, default: 0 },
    bio: { type: String, trim: true },
    subspacesJoined: {
        type: [condenseSubspaceSchema],
        default: []
    },
    subspacesJoinedCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
});

const User = mongoose.model("User", userSchema);
export default User;