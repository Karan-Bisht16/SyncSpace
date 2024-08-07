const saltRounds = 10;
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { condenseUserInfo } from "../utils/functions.js";

// This method is obsolete. Only useful to convert old token type to new ones
const fetchUserSession = async (req, res) => {
    try {
        console.log("Database called");
        const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
        const user = await User.findOne({ email: email });
        if (user) {
            const userTokenInfo = condenseUserInfo(user);
            const token = jwt.sign(userTokenInfo, process.env.JWT_TOKEN_KEY, { expiresIn: 365 * 24 * 60 * 60 * 1000 });
            res.status(200).json({ user: userTokenInfo, token });
        } else {
            res.status(409).json({ message: "No user for given token" });
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const fetchUserInfo = async (req, res) => {
    try {
        const { userName } = req.query;
        const user = await User.findOne({ userName: userName }).select("-password");
        if (user) {
            res.status(200).json(user);
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
                const userTokenInfo = condenseUserInfo(checkIfLoginOrSignUp);
                const customToken = jwt.sign(userTokenInfo, process.env.JWT_TOKEN_KEY, { expiresIn: 365 * 24 * 60 * 60 * 1000 });
                res.status(200).json({ user: userTokenInfo, token: customToken });
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
            const userTokenInfo = condenseUserInfo(newUser);
            const customToken = jwt.sign(userTokenInfo, process.env.JWT_TOKEN_KEY, { expiresIn: 365 * 24 * 60 * 60 * 1000 });
            res.status(200).json({ user: userTokenInfo, token: customToken });
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
                const userTokenInfo = condenseUserInfo(newUser);
                const token = jwt.sign(userTokenInfo, process.env.JWT_TOKEN_KEY, { expiresIn: 365 * 24 * 60 * 60 * 1000 });
                res.status(200).json({ user: userTokenInfo, token });
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
                const userTokenInfo = condenseUserInfo(existingUser);
                const token = jwt.sign(userTokenInfo, process.env.JWT_TOKEN_KEY, { expiresIn: 365 * 24 * 60 * 60 * 1000 });
                res.status(200).json({ user: userTokenInfo, token });
            } else {
                res.status(400).json({ message: "Invalid credentials" });
            }
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const updateProfile = async (req, res) => {
    try {
        const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
        const { name, bio } = req.body;
        const isUserNameUnique = await User.findOne({ name: name });
        if (!isUserNameUnique) {
            const updatedUser = await User.findOneAndUpdate({ email: email }, { name: name, userName: name.replace(/ /g, "-"), bio: bio }, { new: true });
            res.status(200).json(condenseUserInfo(updatedUser));
        } else if (isUserNameUnique.email === email) {
            const updatedUser = await User.findByIdAndUpdate(isUserNameUnique._id, { bio: bio }, { new: true });
            res.status(200).json(condenseUserInfo(updatedUser));
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

export { fetchUserSession, fetchUserInfo, getGoogleUser, createGoogleUser, signUp, signIn, updateProfile, changePassword, deleteProfile };