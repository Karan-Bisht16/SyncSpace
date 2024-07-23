const saltRounds = 10;
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { createUserSession } from "../utils/functions.js";

const fetchUserSession = async (req, res) => {
    try {
        if (req.session.user) {
            res.status(200).json(req.session.user);
        } else {
            const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
            const user = await User.findOne({ email: email });
            if (user) {
                res.status(200).json(createUserSession(user));
            } else {
                res.status(409).json({ message: "No user for given token" });
            }
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const fetchUserInfo = async (req, res) => {
    try {
        const { userName } = req.query;
        const user = await User.findOne({ userName: userName });
        if (user) {
            const { password, ...updatedUser } = user._doc;
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const getGoogleUser = async (req, res) => {
    try {
        const { email, picture, sub } = jwt.decode(req.query.token);
        const isUserEmailUnique = await User.findOne({ email: email, googleId: { $ne: sub } });
        if (isUserEmailUnique) {
            res.status(400).json({ message: "Email already registered. Sign In with password" });
        } else {
            const checkIfLoginOrSignUp = await User.findOne({ googleId: sub });
            if (checkIfLoginOrSignUp) {
                if (checkIfLoginOrSignUp.avatar !== picture) {
                    await User.findByIdAndUpdate(checkIfLoginOrSignUp._id, { avatar: picture });
                }
                res.status(200).json({ user: createUserSession(checkIfLoginOrSignUp), token: req.query.token });
            } else {
                res.status(409).json({ message: "Unique username required" });
            }
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const createGoogleUser = async (req, res) => {
    try {
        const { name, token } = req.query;
        const isUserNameUnique = await User.findOne({ name: name });
        if (isUserNameUnique) {
            res.status(400).json({ message: "Username not available" });
        } else {
            const { email, picture, sub } = jwt.decode(token);
            const newUser = await User.create({
                name: name,
                userName: name.replace(/ /g, "-"),
                email: email,
                googleId: sub,
                avatar: picture,
            });
            res.status(200).json({ user: createUserSession(newUser), token: token });
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const signUp = async (req, res) => {
    try {
        const { userName, userEmail, userPassword } = req.body;
        const isUserNameUnique = await User.findOne({ name: userName.replace(/ /g, "-") });
        if (isUserNameUnique) {
            res.status(400).json({ message: "Username not available" });
        } else {
            const isUserEmailUnique = await User.findOne({ email: userEmail });
            if (isUserEmailUnique) {
                res.status(400).json({ message: "Email already registered. Sign In" });
            } else {
                const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
                const newUser = await User.create({
                    name: userName,
                    userName: userName.replace(/ /g, "-"),
                    email: userEmail,
                    password: hashedPassword,
                });
                const token = jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.JWT_TOKEN_KEY, { expiresIn: 365 * 24 * 60 * 60 * 1000 });
                res.status(200).json({ user: createUserSession(newUser), token });
            }
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try agin" }) }
}

const signIn = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;
        const existingUser = await User.findOne({ email: userEmail });
        if (!existingUser) {
            res.status(404).json({ message: "No such user found" });
        } else {
            if (await bcrypt.compare(userPassword, existingUser.password)) {
                const token = jwt.sign({ _id: existingUser._id, email: existingUser.email }, process.env.JWT_TOKEN_KEY, { expiresIn: 365 * 24 * 60 * 60 * 1000 });
                res.status(200).json({ user: createUserSession(existingUser), token });
            } else {
                res.status(400).json({ message: "Invalid credentials" });
            }
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout successfull!" });
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const updateProfile = async (req, res) => {
    try {
        const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
        const { name, bio } = req.body;
        const isUserNameUnique = await User.findOne({ name: name });
        if (!isUserNameUnique) {
            const updatedUser = await User.findOneAndUpdate({ email: email }, { name: name, userName: name.replace(/ /g, "-"), bio: bio }, { new: true });
            res.status(200).json(createUserSession(updatedUser));
        } else if (isUserNameUnique.email === email) {
            const updatedUser = await User.findByIdAndUpdate(isUserNameUnique._id, { bio: bio }, { new: true });
            res.status(200).json(createUserSession(updatedUser));
        } else {
            res.status(400).json({ message: "Username not available" });
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const changePassword = async (req, res) => {
    try {
        const { email, sub } = jwt.decode(req.headers.authorization.split(" ")[1]);
        if (!sub) {
            const { currentPassword, newPassword } = req.body;
            const existingUser = await User.findOne({ email: email });
            if (await bcrypt.compare(currentPassword, existingUser.password)) {
                const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
                await User.findByIdAndUpdate(existingUser._id, { password: hashedPassword });
                res.sendStatus(200);
            } else {
                res.status(409).json({ message: "Provided password is incorrect" });
            }
        } else {
            res.status(400).json({ message: "Invalid access" })
        }

    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const deleteProfile = async (req, res) => {
    try {
        const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
        await User.updateOne({ email: email }, {
            $unset: { email: "", password: "", googleId: "", avatar: "", dateJoined: "", credits: "", bio: "", subspacesJoined: "", subspacesJoinedCount: "", postsCount: "" },
            isDeleted: true,
        });
        res.sendStatus(200);
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

export { fetchUserSession, fetchUserInfo, getGoogleUser, createGoogleUser, signUp, signIn, logout, updateProfile, changePassword, deleteProfile };