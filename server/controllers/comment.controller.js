import { ObjectId } from "mongodb"
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

const fetchComments = async (req, res) => {
    try {
        const { id } = req.query;
        const comments = await Comment.aggregate([
            {
                $match: {
                    postId: new ObjectId(id),
                    parentId: null
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    postId: 1,
                    parentId: 1,
                    comment: 1,
                    repliesCount: 1,
                    createdAt: 1,
                    "userDetails.userName": 1,
                    "userDetails.avatar": 1,
                    "userDetails.isDeleted": 1,
                },
            },
        ])
        res.status(200).json(comments);
    } catch (error) { res.status(503).json({ message: "Network error. Try ogain." }) }
}

const createComment = async (req, res) => {
    try {
        const { postId, userId } = req.body;
        const comment = await Comment.create(req.body);
        const user = await User.findById(userId);
        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
        res.status(200).json({
            _id: comment._id,
            userId: comment.userId,
            postId: comment.postId,
            comment: comment.comment,
            repliesCount: comment.repliesCount,
            createdAt: comment.createdAt,
            userDetails: {
                userName: user.userName,
                avatar: user.avatar,
                isDeleted: user.isDeleted,
            }
        });
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const fetchReplies = async (req, res) => {
    try {
        const { postId, parentId } = req.query;
        const comments = await Comment.aggregate([
            {
                $match: {
                    postId: new ObjectId(postId),
                    parentId: new ObjectId(parentId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails",
                },
            },
            { $unwind: "$userDetails" },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    postId: 1,
                    parentId: 1,
                    comment: 1,
                    repliesCount: 1,
                    createdAt: 1,
                    "userDetails.userName": 1,
                    "userDetails.avatar": 1,
                    "userDetails.isDeleted": 1,
                },
            },
        ])
        res.status(200).json(comments);
    } catch (error) { res.status(503).json({ message: "Network error. Try ogain." }) }
}

const createReply = async (req, res) => {
    try {
        const { postId, userId, parentId } = req.body;
        const comment = await Comment.create(req.body);
        const user = await User.findById(userId);
        await Comment.findByIdAndUpdate(parentId, { $inc: { repliesCount: 1 } });
        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
        res.status(200).json({
            _id: comment._id,
            userId: comment.userId,
            postId: comment.postId,
            parentId: comment.parentId,
            comment: comment.comment,
            repliesCount: comment.repliesCount,
            createdAt: comment.createdAt,
            userDetails: {
                userName: user.userName,
                avatar: user.avatar,
                isDeleted: user.isDeleted,
            }
        });
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const deleteComment = async (req, res) => {
    try {
        const { _id } = req.query;
        await Comment.findByIdAndUpdate(_id, { comment: "[Deleted]" })
        res.sendStatus(200);
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

export { fetchComments, createComment, deleteComment, fetchReplies, createReply };