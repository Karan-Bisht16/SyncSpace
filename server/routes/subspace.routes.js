import express from "express";
import auth from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { fetchSubspaces, fetchSubspaceInfo, createSubspace, uploadSubspaceAvatar, isSubspaceJoined, joinSubspace, updateSubspace, deleteSubspace } from "../controllers/subspace.controller.js";

const router = express.Router();

router.post("/", auth, fetchSubspaces);
router.get("/info", fetchSubspaceInfo);
router.post("/create", auth, createSubspace);
router.post("/uploadAvatar", auth, upload.single("avatar"), uploadSubspaceAvatar);
router.get("/isJoined", auth, isSubspaceJoined);
router.patch("/join", auth, joinSubspace);
router.put("/update", auth, updateSubspace);
router.delete("/delete", auth, deleteSubspace);

export default router;