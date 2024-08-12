import express from "express";
import auth from "../middleware/auth.middleware.js";
import { fetchComments, createComment, deleteComment } from "../controllers/comment.controller.js";
import { fetchReplies, createReply } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/", fetchComments);
router.post("/create", auth, createComment);
router.delete("/delete", auth, deleteComment);

router.get("/reply/", fetchReplies);
router.post("/reply/create", auth, createReply);

export default router;