import mongoose from "mongoose";

const user_Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    avatar: {
        type: String,
    },
    dateJoined: {
        type: Date,
        default: Date.now,
    },
    // change name
    karma: {
        type: Number,
        default: 0,
    },
    bio: {
        type: String,
        trim: true,
    },
    subspacesJoined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subspaces",
    }]
});

const User = mongoose.model("User", user_Schema);
export default User;