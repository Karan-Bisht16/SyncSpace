import jwt from "jsonwebtoken";
import Post from "../models/post.js";
import User from "../models/user.js";
import Like from "../models/like.js"
import Subspace from "../models/subspace.js";
import { ObjectId } from "mongodb"

let globalCount = 0;
const LIMIT = process.env.POSTS_LIMIT || 2;

const fetchPostInfo = async (req, res) => {
    try {
        const { id } = req.query;
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (error) { res.status(404).json({ message: "Network error. Try again." }) }
}

const fetchPosts = async (req, res) => {
    try {
        const { pageParams, searchQuery, customParams } = req.body;
        const startIndex = (Number(pageParams) - 1) * LIMIT;
        let posts = [];
        let total = 0;
        if (customParams === "HOME_PAGE") {
            posts = await Post.find({}).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
            total = await Post.countDocuments({});
        } else if (customParams === "LIKED_POSTS") {
            posts = await Like.aggregate([
                { $match: { userId: new ObjectId(searchQuery.userId) } },
                { $sort: { _id: -1 } },
                { $skip: Number(startIndex) },
                { $limit: Number(LIMIT) },
                {
                    $lookup: {
                        from: "posts",
                        localField: "postId",
                        foreignField: "_id",
                        as: "postDetails"
                    }
                },
                { $unwind: "$postDetails" },
                {
                    $replaceRoot: { newRoot: "$postDetails" }
                }
            ]);
            total = await Like.countDocuments(searchQuery);
        } else {
            posts = await Post.find(searchQuery).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
            total = await Post.countDocuments(searchQuery);
        }
        const currentPage = Number(pageParams);
        const count = Math.ceil(total / LIMIT);
        console.log(`${globalCount} Limited posts: ${posts.length}`);
        console.log(searchQuery);
        globalCount++;
        if (currentPage === 1) {
            if (total > LIMIT) {
                res.status(200).json({ count: count, previous: null, next: currentPage + 1, results: posts });
            } else {
                res.status(200).json({ count: count, previous: null, next: null, results: posts });
            }
        } else if (currentPage === count) {
            res.status(200).json({ count: count, previous: currentPage - 1, next: null, results: posts });
        } else {
            res.status(200).json({ count: count, previous: currentPage - 1, next: currentPage + 1, results: posts });
        }
    } catch (error) { console.log(error); res.status(404).json({ message: "Network error. Try again." }) }
}

const createPost = async (req, res) => {
    const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
    const post = req.body;
    console.log(`${post.subspaceName}, ${post.authorName}, ${post.title}, `);
    const newPost = new Post(post);
    try {
        await newPost.save();
        await User.findOneAndUpdate({ email: email }, { $inc: { postsCount: 1 } });
        await Subspace.findOneAndUpdate({ subspaceName: post.subspaceName }, { $inc: { postsCount: 1 } });
        res.status(200).json(newPost);
    } catch (error) { res.status(409).json({ message: "Network error. Try again." }) }
}

const deletePost = async (req, res) => {
    const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
    const { postId } = req.query;
    try {
        const post = await Post.findByIdAndDelete(postId);
        await User.findOneAndUpdate({ email: email }, { $inc: { postsCount: -1 } });
        await Subspace.findOneAndUpdate({ subspaceName: post.subspaceName }, { $inc: { postsCount: -1 } });
        res.sendStatus(200);
    } catch (error) { res.status(409).json({ message: "Network error. Try again." }) }
}

const isPostLiked = async (req, res) => {
    const { postId, userId } = req.query;
    try {
        const isLiked = await Like.findOne({ postId: postId, userId: userId });
        if (isLiked) {
            res.status(200).json(true);
        } else {
            res.status(200).json(false);
        }
    } catch (error) { console.log(error); res.status(409).json({ message: "Network error. Try again." }) }
}

const likePost = async (req, res) => {
    const { postId, userId, action } = req.body;
    console.log(postId, userId, action);
    try {
        if (action) {
            const post = await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } }, { new: true });
            await User.findByIdAndUpdate(post.authorId, { $inc: { credits: 1 } })
            await Like.create({ postId: postId, userId: userId });
        } else {
            await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });
            await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } });
            await Like.findOneAndDelete({ postId: postId, userId: userId });
        }
        res.sendStatus(200);
    } catch (error) { console.log(error); res.status(409).json({ message: "Network error. Try again." }) }
}

export { fetchPosts, fetchPostInfo, createPost, deletePost, isPostLiked, likePost };