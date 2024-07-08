import mongoose from "mongoose";

const post_Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
    },
    selectedFile: {
        type: Array,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    subspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSpace",
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ],
    commentCount: {
        type: Number,
        default: 0,
    }
    // kon-kon se posts m user n like kiya h? same as comments?
});

const Post = mongoose.model("Post", post_Schema);
export default Post;