import Post from "../models/post.js";

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        // console.log("All posts: " + posts);
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error retriving posts:" + error);
        res.status(404).json({ message: "Network error. Try again." });
    }
}
const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new Post(post);
    try {
        // console.log(post);
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.log("Error adding new post: " + error);
        res.status(409).json({ message: "Network error. Try again." });
    }
}

export { getPosts, createPost };