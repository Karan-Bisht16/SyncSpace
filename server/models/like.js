import mongoose from "mongoose";

const like_Schema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSpace", required: true }
});

const Like = mongoose.model("Like", like_Schema);
export default Like;