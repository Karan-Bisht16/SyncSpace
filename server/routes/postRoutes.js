import express from "express";
import auth from "../middleware/auth.js";
import { fetchPostInfo, fetchPosts, createPost, isPostLiked, likePost, updatePost, deletePost } from "../controllers/postOperations.js";

const router = express.Router();

router.post("/", fetchPosts);
router.get("/info", fetchPostInfo);
router.post("/create", auth, createPost);
router.get("/isLiked", auth, isPostLiked);
router.patch("/like", auth, likePost);
router.put("/update", auth, updatePost);
router.delete("/delete", auth, deletePost);

export default router;