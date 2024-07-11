import mongoose from "mongoose";

const condenseCommentSchema = mongoose.Schema({
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }
});

const post_Schema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    body: { type: String },
    selectedFile: { type: Array },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, trim: true, required: true },
    subspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSpace", required: true },
    subspaceName: { type: String, trim: true, required: true },
    dateCreated: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: {
        type: [condenseCommentSchema],
        default: []
    },
    commentsCount: { type: Number, default: 0 }
});

const Post = mongoose.model("Post", post_Schema);
export default Post;