import mongoose from "mongoose";

const condenseUserSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, trim: true },
    userName: { type: String, trim: true },
});

const subspaceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    subspaceName: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    avatar: { type: String },
    creator: { type: condenseUserSchema, required: true },
    dateCreated: { type: Date, default: Date.now },
    members: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }],
    membersCount: { type: Number, default: 1 },
    moderators: [{ type: condenseUserSchema }],
    topics: { type: mongoose.Schema.Types.Array, required: true },
    postsCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
});

const Subspace = mongoose.model("Subspace", subspaceSchema);
export default Subspace;