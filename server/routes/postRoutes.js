import express from "express";
import auth from "../middleware/auth.js";
import { fetchPostInfo, fetchPosts, createPost, deletePost, isPostLiked, likePost } from "../controllers/postOperations.js";

const router = express.Router();

router.get("/", fetchPostInfo);
router.post("/", fetchPosts);
router.post("/createPost", auth, createPost);
router.delete("/deletePost", auth, deletePost);
router.get("/isPostLiked", auth, isPostLiked);
router.patch("/likePost", auth, likePost);

export default router;