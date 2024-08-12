import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import Post from "../models/post.js";
import User from "../models/user.js";
import Like from "../models/like.js";
import Join from "../models/join.js";
import Subspace from "../models/subspace.js";
import { pagination, postDetailsExtraction, authorAndSubspaceDetails, postDataStructure, baseQuery } from "../utils/aggregationPipeline.js";

const LIMIT = process.env.POSTS_LIMIT || 2;

const fetchPosts = async (req, res) => {
    try {
        const { pageParams, searchQuery, customParams } = req.body;
        const startIndex = (Number(pageParams) - 1) * LIMIT;
        let posts = [];
        let total = 0;
        let message;
        if (customParams === "HOME_PAGE") {
            if (req.cookies?.accessToken) {
                const { _id } = jwt.decode(req.cookies?.accessToken);
                const user = await User.findById(_id);
                if (user && user.subspacesJoined > 0) {
                    posts = await Join.aggregate([
                        { $match: { userId: new ObjectId(_id) } },
                        {
                            $lookup: {
                                from: "posts",
                                localField: "subspaceId",
                                foreignField: "subspaceId",
                                as: "postDetails",
                            },
                        },
                        ...postDetailsExtraction,
                        ...baseQuery(startIndex, LIMIT),
                    ]);
                    const [{ totalCount }] = await Join.aggregate([
                        { $match: { userId: new ObjectId(_id) } },
                        {
                            $lookup: {
                                from: "posts",
                                localField: "subspaceId",
                                foreignField: "subspaceId",
                                as: "postDetails",
                            },
                        },
                        ...postDetailsExtraction,
                        {
                            $group: {
                                _id: null,
                                totalCount: { $count: {} }
                            }
                        }
                    ]);
                    total = totalCount;
                } else {
                    posts = await Post.aggregate([
                        ...baseQuery(startIndex, LIMIT),
                    ]);
                    total = await Post.countDocuments({});
                    message = "Join any subspace of your choice to see relevant posts."
                }
            } else {
                posts = await Post.aggregate([
                    ...baseQuery(startIndex, LIMIT),
                ]);
                total = await Post.countDocuments({});
            }
        } else if (customParams === "LIKED_POSTS") {
            posts = await Like.aggregate([
                { $match: { userId: new ObjectId(searchQuery.userId) } },
                { $sort: { _id: -1 } },
                ...pagination(startIndex, LIMIT),
                {
                    $lookup: {
                        from: "posts",
                        localField: "postId",
                        foreignField: "_id",
                        as: "postDetails",
                    },
                },
                ...postDetailsExtraction,
                ...authorAndSubspaceDetails,
                postDataStructure,
            ]);
            total = await Like.countDocuments(searchQuery);
        } else if (customParams === "TRENDING_PAGE") {
            posts = await Post.aggregate([
                ...baseQuery(startIndex, LIMIT),
            ]);
            total = await Post.countDocuments({});
        } else if (searchQuery.subspaceId) {
            posts = await Post.aggregate([
                { $match: { subspaceId: new ObjectId(searchQuery.subspaceId) } },
                ...baseQuery(startIndex, LIMIT),
            ]);
            total = await Post.countDocuments(searchQuery);
        } else if (searchQuery.authorId) {
            posts = await Post.aggregate([
                { $match: { authorId: new ObjectId(searchQuery.authorId) } },
                { $sort: { _id: -1 } },
                ...pagination(startIndex, LIMIT),
                ...authorAndSubspaceDetails,
                postDataStructure,
            ]);
            total = await Post.countDocuments(searchQuery);
        }
        const currentPage = Number(pageParams);
        const count = Math.ceil(total / LIMIT);
        if (currentPage === 1) {
            if (total > LIMIT) {
                res.status(200).json({ count: count, previous: null, next: currentPage + 1, results: posts, message });
            } else {
                res.status(200).json({ count: count, previous: null, next: null, results: posts, message });
            }
        } else if (currentPage === count) {
            res.status(200).json({ count: count, previous: currentPage - 1, next: null, results: posts });
        } else {
            res.status(200).json({ count: count, previous: currentPage - 1, next: currentPage + 1, results: posts });
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const fetchPostInfo = async (req, res) => {
    try {
        const { id } = req.query;
        try {
            const post = await Post.aggregate([
                { $match: { _id: new ObjectId(id) } },
                ...authorAndSubspaceDetails,
                postDataStructure,
            ]);
            if (post.length === 0) {
                res.status(404).json({ message: "No post found" });
            } else {
                res.status(200).json(post[0]);
            }
        } catch (BSONError) {
            res.status(404).json({ message: "No post found" });
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try ogain." }) }
}

const createPost = async (req, res) => {
    try {
        const { _id } = req.user;
        const post = req.body;
        const newPost = new Post(post);
        await newPost.save();
        await User.findByIdAndUpdate(_id, { $inc: { postsCount: 1 } });
        await Subspace.findByIdAndUpdate(post.subspaceId, { $inc: { postsCount: 1 } });
        res.status(200).json(newPost);
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const isPostLiked = async (req, res) => {
    try {
        const { postId, userId } = req.query;
        const isLiked = await Like.findOne({ postId: postId, userId: userId });
        if (isLiked) return res.status(200).json(true);
        res.status(200).json(false);
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const likePost = async (req, res) => {
    try {
        const { postId, userId, action } = req.body;
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
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const updatePost = async (req, res) => {
    try {
        const { _id } = req.user;
        const { postId, updatedData } = req.body;
        const tempUpdatedData = { ...updatedData, edited: true };
        const post = await Post.findById(postId);
        if (!post.authorId.equals(_id)) return res.status(409).json({ message: "Unauthorised access" });

        await Post.findByIdAndUpdate(postId, tempUpdatedData);
        res.sendStatus(200);
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const deletePost = async (req, res) => {
    try {
        const { _id } = req.user;
        const { postId } = req.query;
        const post = await Post.findByIdAndDelete(postId);
        await User.findByIdAndUpdate(_id, { $inc: { postsCount: -1 } });
        await Subspace.findByIdAndUpdate(post.subspaceId, { $inc: { postsCount: -1 } });
        res.sendStatus(200);
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

export { fetchPosts, fetchPostInfo, createPost, isPostLiked, likePost, updatePost, deletePost };