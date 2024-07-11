import express from "express";
import auth from "../middleware/auth.js";
import { getGoogleUser, createGoogleUser, signUp, signIn, logout } from "../controllers/userOperations.js";
import { fetchUserSession, fetchUserInfo, fetchUserPosts, updateProfile, changePassword, deleteProfile } from "../controllers/userOperations.js";

const router = express.Router();

// I think working but not sure
router.get("/session", auth, fetchUserSession);
router.get("/", auth, fetchUserInfo);
// working
router.get("/posts", auth, fetchUserPosts);
// cannot try
router.get("/getGoogleUser", auth, getGoogleUser);
router.get("/createGoogleUser", auth, createGoogleUser);
// working
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.delete("/logout", auth, logout);
// error h
router.patch("/updateProfile", auth, updateProfile);
// working
router.patch("/changePassword", auth, changePassword);
router.delete("/deleteProfile", auth, deleteProfile);

export default router;