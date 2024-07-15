import express from "express";
import auth from "../middleware/auth.js";
import { createSubspace, joinSubspace, fetchAllSubspaceInfo, fetchSubspaceAvatar } from "../controllers/subspaceOperations.js";

const router = express.Router();

router.post("/", auth, createSubspace);
router.get("/join", auth, joinSubspace);
router.get("/info", fetchAllSubspaceInfo);
router.get("/avatar", fetchSubspaceAvatar);

export default router;