import jwt from "jsonwebtoken";
import Post from "../models/post.js";
import User from "../models/user.js";
import Subspace from "../models/subspace.js";

let globalCount = 0;
const LIMIT = process.env.POSTS_LIMIT;

const fetchPostInfo = async (req, res) => {
    try {
        const { id } = req.query;
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (error) { res.status(404).json({ message: "Network error. Try again." }) }
}

const fetchPosts = async (req, res) => {
    try {
        const { pageParams, searchQuery } = req.body;
        const startIndex = (Number(pageParams) - 1) * LIMIT;
        let posts = [];
        let total = 0;
        if (searchQuery) {
            posts = await Post.find(searchQuery).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
            total = await Post.countDocuments(searchQuery);
        } else {
            posts = await Post.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
            total = await Post.countDocuments({});
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
    } catch (error) { res.status(404).json({ message: "Network error. Try again." }) }
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

export { fetchPosts, fetchPostInfo, createPost };