import express from "express";
import auth from "../middleware/auth.js";
import { fetchPostInfo, fetchAdditionalPostInfo, fetchPosts, createPost, deletePost, isPostLiked, likePost } from "../controllers/postOperations.js";

const router = express.Router();

router.post("/", fetchPosts);
router.get("/info", fetchPostInfo);
router.get("/addInfo", fetchAdditionalPostInfo);
router.post("/createPost", auth, createPost);
router.get("/isLiked", auth, isPostLiked);
router.patch("/likePost", auth, likePost);
router.delete("/deletePost", auth, deletePost);

export default router;