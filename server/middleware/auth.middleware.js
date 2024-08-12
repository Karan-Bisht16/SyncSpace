import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
        if (!accessToken) return res.status(402).json({ message: "Unauthorized access" });

        try {
            const decodedData = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decodedData?._id).select("-password -refreshToken");
            if (!user) return res.status(409).json({ message: "Invalid token credentials." });

            req.user = user;
        } catch (error) {
            const incomingRefreshToken = req.cookies?.refreshToken;
            if (!incomingRefreshToken) return res.sendStatus(401, "Unauthorized access");

            const decodedData = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await User.findById(decodedData?._id).select("-password");
            if (!user) return res.status(409).json({ message: "Invalid token credentials." });

            if (incomingRefreshToken !== user.refreshToken) return res.status(401).json({ message: "Refresh token has expired" });

            req.user = user;
            req.refreshedAccessToken = true;
        }
        next();
    } catch (error) { res.sendStatus(503) }
}

export default auth;