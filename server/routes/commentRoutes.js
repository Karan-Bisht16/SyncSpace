import express from "express";
import auth from "../middleware/auth.js";
import { fetchComments, createComment, deleteComment } from "../controllers/commentOperations.js";
import { fetchReplies, createReply } from "../controllers/commentOperations.js";

const router = express.Router();

router.get("/", fetchComments);
router.post("/create", auth, createComment);
router.delete("/delete", auth, deleteComment);

router.get("/reply/", fetchReplies);
router.post("/reply/create", auth, createReply);

export default router;