import express from "express";
import auth from "../middleware/auth.js";
import { createSubspace, joinSubspace, fetchAllSubspaceInfo, fetchSubspacePosts } from "../controllers/subspaceOperations.js";

const router = express.Router();

// not working on deployment
router.post("/", auth, createSubspace);
router.get("/join", auth, joinSubspace);
// working
router.get("/info", fetchAllSubspaceInfo);
router.get("/posts", fetchSubspacePosts);

export default router;