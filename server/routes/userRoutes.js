import express from "express";
import auth from "../middleware/auth.js";
import { getGoogleUser, createGoogleUser, signUp, signIn } from "../controllers/userOperations.js";
import { fetchUserSession, fetchUserInfo, updateProfile, changePassword, deleteProfile } from "../controllers/userOperations.js";

const router = express.Router();

router.get("/session", auth, fetchUserSession);
router.get("/", fetchUserInfo);
router.get("/getGoogleUser", getGoogleUser);
router.get("/createGoogleUser", createGoogleUser);
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.patch("/updateProfile", auth, updateProfile);
router.patch("/changePassword", auth, changePassword);
router.delete("/deleteProfile", auth, deleteProfile);

export default router;