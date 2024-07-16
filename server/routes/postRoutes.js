import express from "express";
import auth from "../middleware/auth.js";
import { fetchPostInfo, fetchPosts, createPost, deletePost } from "../controllers/postOperations.js";

const router = express.Router();

router.get("/", fetchPostInfo);
router.post("/", fetchPosts);
router.post("/createPost", auth, createPost);
router.get("/deletePost", auth, deletePost);

export default router;