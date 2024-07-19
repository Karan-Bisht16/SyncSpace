import mongoose from "mongoose";

const comment_Schema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSpace", required: true },
    body: { type: String, required: true },
});

const Comment = mongoose.model("Comment", comment_Schema);
export default Comment;