import express from "express";
import auth from "../middleware/auth.js";
import { createSubspace, joinSubspace, fetchAllSubspaceInfo, fetchSubspacePosts } from "../controllers/subspaceOperations.js";

const router = express.Router();

// not working on deployment
router.post("/", auth, createSubspace);
// create kar raha h par req.session m update nahi ker raha + join nahi kar raha
router.get("/join", auth, joinSubspace);
// cannot read property of undefined 'subspacesJoined': req.session.user undefined h :(
// working
router.get("/info", fetchAllSubspaceInfo);
router.get("/posts", fetchSubspacePosts);

export default router;