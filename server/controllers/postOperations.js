import jwt from "jsonwebtoken";
import Post from "../models/post.js";
import User from "../models/user.js";

let globalCount = 1;
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        console.log(`${globalCount} All posts: ${posts.length}`);
        globalCount++;
        res.status(200).json(posts);
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
        res.status(200).json(newPost);
    } catch (error) { res.status(409).json({ message: "Network error. Try again." }) }
}

export { getPosts, createPost };