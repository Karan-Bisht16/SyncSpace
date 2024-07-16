import mongoose from "mongoose";

const post_Schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    body: { type: String },
    selectedFile: { type: Array },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, trim: true, required: true },
    subspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSpace", required: true },
    subspaceName: { type: String, trim: true, required: true },
    dateCreated: { type: Date, default: Date.now },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    edited: { type: Boolean, default: false }
});

const Post = mongoose.model("Post", post_Schema);
export default Post;