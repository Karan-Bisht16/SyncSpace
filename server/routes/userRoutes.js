import express from "express";
import auth from "../middleware/auth.js";
import { getGoogleUser, createGoogleUser, signUp, signIn, logout } from "../controllers/userOperations.js";
import { fetchUserSession, fetchUserInfo, fetchUserPosts, updateProfile, changePassword, deleteProfile } from "../controllers/userOperations.js";

const router = express.Router();

router.get("/session", auth, fetchUserSession);
router.get("/", auth, fetchUserInfo);
router.get("/posts", auth, fetchUserPosts);
router.get("/getGoogleUser", auth, getGoogleUser);
router.get("/createGoogleUser", auth, createGoogleUser);
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.delete("/logout", auth, logout);
router.patch("/updateProfile", auth, updateProfile);
router.patch("/changePassword", auth, changePassword);
router.delete("/deleteProfile", auth, deleteProfile);

export default router;