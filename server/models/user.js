import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String },
    googleId: { type: String },
    viaGoogle: { type: Boolean, default: false },
    refreshToken: { type: String },
    avatar: { type: String, default: "" },
    dateJoined: { type: Date, default: Date.now },
    bio: { type: String, trim: true, default: "" },
    credits: { type: Number, default: 0 },
    subspacesJoined: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = async function (password) {
    return await jwt.sign(
        { _id: this._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
}
userSchema.methods.generateRefreshToken = async function (password) {
    return await jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

const User = mongoose.model("User", userSchema);
export default User;