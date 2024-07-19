import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String, default: "" },
    dateJoined: { type: Date, default: Date.now },
    bio: { type: String, trim: true, default: "" },
    credits: { type: Number, default: 0 },
    subspacesJoined: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false }
});

const User = mongoose.model("User", userSchema);
export default User;