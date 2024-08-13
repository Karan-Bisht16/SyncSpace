import multer from "multer";
import express from "express";
import auth from "../middleware/auth.middleware.js";
import { fetchPosts, fetchPostInfo, createPost, uploadPostMedia, isPostLiked, likePost, updatePost, deletePost } from "../controllers/post.controller.js";

const router = express.Router();
const upload = multer({
    limits: { fieldSize: 25 * 1024 * 1024 },
    storage: multer.memoryStorage()
});

router.post("/", fetchPosts);
router.get("/info", fetchPostInfo);
router.post("/create", auth, createPost);
router.post("/uploadMedia", auth, upload.any("files"), uploadPostMedia);
router.get("/isLiked", auth, isPostLiked);
router.patch("/like", auth, likePost);
router.put("/update", auth, updatePost);
router.delete("/delete", auth, deletePost);

export default router;