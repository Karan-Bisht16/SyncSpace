import mongoose from "mongoose";

const comment_Schema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postTitle: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "SubSpace", required: true },
    userName: { type: String, required: true },
    likesCount: { type: Number, required: true },
});

const Comment = mongoose.model("Comment", comment_Schema);
export default Comment;
// fetch subspace avatar otherwise
// const condenseCommentSchema = mongoose.Schema({
//     commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }
// });
// comments: {
//     type: [condenseCommentSchema],
//     default: []
// }