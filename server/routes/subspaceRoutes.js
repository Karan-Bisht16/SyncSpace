import express from "express";
import auth from "../middleware/auth.js";
import { fetchSubspaceInfo, fetchSubspaces, createSubspace, isSubspaceJoined, joinSubspace, updateSubspace, deleteSubspace } from "../controllers/subspaceOperations.js";

const router = express.Router();

router.post("/", auth, fetchSubspaces);
router.get("/info", fetchSubspaceInfo);
router.post("/createSubspace", auth, createSubspace);
router.get("/isJoined", auth, isSubspaceJoined);
router.patch("/join", auth, joinSubspace);
router.put("/update", auth, updateSubspace);
router.delete("/delete", auth, deleteSubspace);

export default router;