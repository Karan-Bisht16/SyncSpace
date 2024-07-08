import express from "express";
import auth from "../middleware/auth.js";
import { fetchUserSession, fetchUserInfo, fetchUserPosts, getGoogleUser, createGoogleUser, signUp, signIn, logout } from "../controllers/userOperations.js";

const router = express.Router();

router.get("/session", auth, fetchUserSession);
router.get("/", auth, fetchUserInfo);
router.get("/posts", auth, fetchUserPosts);
router.get("/getGoogleUser", auth, getGoogleUser);
router.get("/createGoogleUser", auth, createGoogleUser);
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.delete("/logout", logout);

export default router;