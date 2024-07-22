import mongoose from "mongoose";

const comment_Schema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSpace", required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    comment: { type: String, required: true },
    repliesCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model("Comment", comment_Schema);
export default Comment;