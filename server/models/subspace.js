import mongoose from "mongoose";

const subspaceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    subspaceName: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    avatar: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateCreated: { type: Date, default: Date.now },
    membersCount: { type: Number, default: 1 },
    postsCount: { type: Number, default: 0 },
    topics: { type: mongoose.Schema.Types.Array, required: true },
    isDeleted: { type: Boolean, default: false }
});

const Subspace = mongoose.model("Subspace", subspaceSchema);
export default Subspace;