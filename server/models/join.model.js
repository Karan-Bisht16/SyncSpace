import mongoose from "mongoose";

const join_Schema = new mongoose.Schema({
    subspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Subspace", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

const Join = mongoose.model("Join", join_Schema);
export default Join;