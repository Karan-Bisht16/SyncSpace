import express from "express";
import auth from "../middleware/auth.middleware.js";
import { registerViaGoogle, loginViaGoogle, register, login, logout } from "../controllers/user.controller.js";
import { fetchUserSession, fetchUserInfo, updateProfile, changePassword, deleteProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/session", auth, fetchUserSession);
router.get("/", fetchUserInfo);
router.post("/registerViaGoogle", registerViaGoogle);
router.post("/loginViaGoogle", loginViaGoogle);
router.post("/register", register);
router.post("/login", login);
router.patch("/logout", auth, logout);
router.patch("/updateProfile", auth, updateProfile);
router.patch("/changePassword", auth, changePassword);
router.delete("/deleteProfile", auth, deleteProfile);

export default router;