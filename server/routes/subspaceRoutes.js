import express from "express";
import auth from "../middleware/auth.js";
import { createSubspace, joinSubspace } from "../controllers/subspaceOperations.js";

const router = express.Router();

router.get("/", auth, joinSubspace);
router.post("/", auth, createSubspace);

export default router;