import express from "express";
import auth from "../middleware/auth.js";
import { fetchPostInfo, fetchPosts, createPost } from "../controllers/postOperations.js";

const router = express.Router();

router.get("/", fetchPostInfo);
router.post("/", fetchPosts);
router.post("/createPost", auth, createPost);

export default router;