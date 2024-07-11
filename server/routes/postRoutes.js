import express from "express";
import auth from "../middleware/auth.js";
import { getPosts, createPost } from "../controllers/postOperations.js";

const router = express.Router();

// working
router.get("/", getPosts);
router.post("/", auth, createPost);

export default router;