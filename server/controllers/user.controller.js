import jwt from "jsonwebtoken";
import User from "../models/user.js";

const cookiesOptions = {
    httpOnly: true,
    secure: true
};

const condenseUserInfo = (user) => {
    const userSessionObj = {
        _id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        viaGoogle: user.viaGoogle,
        avatar: user.avatar ? user.avatar : "",
    };
    return userSessionObj;
}

const generateAccessAndRefreshTokens = async (user) => {
    try {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) { return null }
}

const fetchUserSession = async (req, res) => {
    try {
        const userInfo = condenseUserInfo(req.user);

        if (!req.refreshedAccessToken) return res.status(200).json(userInfo);

        const user = await User.findById(req.user._id).select("-password -refreshToken");
        const accessToken = await user.generateAccessToken();
        res.status(200)
            .cookie("accessToken", accessToken, cookiesOptions)
            .json(userInfo);
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const fetchUserInfo = async (req, res) => {
    try {
        const { userName } = req.query;
        const user = await User.findOne({ userName: userName }).select("-password -refreshToken");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const registerViaGoogle = async (req, res) => {
    try {
        const { userName, token } = req.body;
        const isUserNameUnique = await User.findOne({ name: userName });
        if (isUserNameUnique) return res.status(400).json({ message: "Username not available" });

        const { email, picture, sub } = jwt.decode(token);
        const newUser = await User.create({
            name: userName,
            userName: userName.replace(/ /g, "-"),
            email: email,
            googleId: sub,
            avatar: picture,
            viaGoogle: true,
        });

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser);
        const userInfo = condenseUserInfo(newUser);

        res.status(200)
            .cookie("accessToken", accessToken, cookiesOptions)
            .cookie("refreshToken", refreshToken, cookiesOptions)
            .json(userInfo);
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const loginViaGoogle = async (req, res) => {
    try {
        const { email, picture, sub } = jwt.decode(req.body.token);
        const isUserEmailUnique = await User.findOne({ email: email, googleId: { $ne: sub } });
        if (isUserEmailUnique) return res.status(400).json({ message: "Email already registered. Sign In with password" });

        const checkIfLoginOrSignUp = await User.findOne({ googleId: sub });
        if (!checkIfLoginOrSignUp) return res.status(409).json({ message: "New user. Unique username required" });

        if (checkIfLoginOrSignUp.avatar !== picture) {
            await User.findByIdAndUpdate(checkIfLoginOrSignUp._id, { avatar: picture });
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(checkIfLoginOrSignUp);
        const userInfo = condenseUserInfo(checkIfLoginOrSignUp);

        res.status(200)
            .cookie("accessToken", accessToken, cookiesOptions)
            .cookie("refreshToken", refreshToken, cookiesOptions)
            .json(userInfo);
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const register = async (req, res) => {
    try {
        const { userName, userEmail, userPassword } = req.body;
        const username = userName.replace(/ /g, "-");
        const isUserNameUnique = await User.findOne({ name: username });
        if (isUserNameUnique) return res.status(400).json({ message: "Username not available" });

        const isUserEmailUnique = await User.findOne({ email: userEmail });
        if (isUserEmailUnique) return res.status(400).json({ message: "Email already registered. Sign In" });

        const newUser = await User.create({
            name: userName,
            userName: username,
            email: userEmail,
            password: userPassword,
        });

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(newUser);
        const userInfo = condenseUserInfo(newUser);

        res.status(200)
            .cookie("accessToken", accessToken, cookiesOptions)
            .cookie("refreshToken", refreshToken, cookiesOptions)
            .json(userInfo);
    } catch (error) { res.status(503).json({ message: "Network error. Try agin" }) }
}

const login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;
        const existingUser = await User.findOne({ email: userEmail });
        if (!existingUser) return res.status(404).json({ message: "No such user found" });

        const isPasswordCorrect = await existingUser.isPasswordCorrect(userPassword);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingUser);
        const userInfo = condenseUserInfo(existingUser);

        res.status(200)
            .cookie("accessToken", accessToken, cookiesOptions)
            .cookie("refreshToken", refreshToken, cookiesOptions)
            .json(userInfo);
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const logout = async (req, res) => {
    try {
        User.findByIdAndUpdate(
            req.user._id,
            {
                $set: { refreshToken: undefined }
            }
        );
        res.status(200)
            .clearCookie("accessToken", cookiesOptions)
            .clearCookie("refreshToken", cookiesOptions)
            .json({ message: "Successfully logged out" });
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const updateProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const { name, bio } = req.body;
        const isUserNameUnique = await User.findOne({ name: name });
        if (!isUserNameUnique) {
            const updatedUser = await User.findOneAndUpdate({ email: email }, { name: name, userName: name.replace(/ /g, "-"), bio: bio }, { new: true });
            res.status(200).json(condenseUserInfo(updatedUser));
        } else if (isUserNameUnique.email === email) {
            const updatedUser = await User.findByIdAndUpdate(isUserNameUnique._id, { bio: bio }, { new: true });
            res.status(200).json(condenseUserInfo(updatedUser));
        } else return res.status(400).json({ message: "Username not available" });
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const changePassword = async (req, res) => {
    try {
        const { _id, viaGoogle } = req.user;
        if (viaGoogle) return res.status(400).json({ message: "Invalid access" });

        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(_id);
        const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
        if (!isPasswordCorrect) return res.status(409).json({ message: "Provided password is incorrect" });

        user.password = newPassword;
        user.save();
        res.sendStatus(200);
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

const deleteProfile = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.updateOne({ _id: _id }, {
            $unset: { email: "", password: "", googleId: "", refreshToken: "", avatar: "", dateJoined: "", credits: "", bio: "", subspacesJoined: "", subspacesJoinedCount: "", postsCount: "" },
            isDeleted: true,
        });
        res.status(200)
            .clearCookie("accessToken", cookiesOptions)
            .clearCookie("refreshToken", cookiesOptions)
            .json({ message: "Profile deleted successfully" });
    } catch (error) { res.status(503).json({ message: "Network error. Try again" }) }
}

export {
    registerViaGoogle, loginViaGoogle, register, login, logout,
    fetchUserSession, fetchUserInfo, updateProfile, changePassword, deleteProfile
};