import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Post from "../models/post.js";
import Subspace from "../models/subspace.js";

const createSubspace = async (req, res) => {
    try {
        const tempSubspace = req.body;
        const subspace = { ...tempSubspace, subspaceName: tempSubspace.name.replace(/ /g, "-") };
        const isSubspaceNameUnique = await Subspace.findOne({ name: subspace.name });
        if (isSubspaceNameUnique) {
            res.status(409).json({ message: "Subspace already exists." })
        } else {
            const newSubspace = new Subspace(subspace);
            const { email } = jwt.decode(req.headers.authorization);
            await newSubspace.save();
            let updatedSubspacesJoined = req.session.user.subspacesJoined;
            updatedSubspacesJoined = [...updatedSubspacesJoined, {
                subspaceId: newSubspace._id,
                name: newSubspace.name,
                description: newSubspace.description,
                avatar: newSubspace.avatar,
            }];
            await User.findOneAndUpdate({ email: email }, { 
                subspacesJoined: updatedSubspacesJoined,
                $inc: { subspacesJoinedCount: 1 }
            });
            req.session.user.subspacesJoined = updatedSubspacesJoined;
            res.status(200).json({ user: req.session.user });
        }
    } catch (error) { res.status(409).json({ message: "Network error. Try again." }) }
}

const joinSubspace = async (req, res) => {
    try {
        const { action, subspaceName } = req.query;
        const { email } = jwt.decode(req.headers.authorization);
        const subspace = await Subspace.findOne({ subspaceName: subspaceName });
        if (action === "true") {
            let updatedSubspacesJoined = req.session.user.subspacesJoined;
            updatedSubspacesJoined = [...updatedSubspacesJoined, {
                subspaceId: subspace._id,
                name: subspace.name,
                description: subspace.description,
                avatar: subspace.avatar,
            }];
            const user = await User.findOneAndUpdate({ email: email }, { 
                subspacesJoined: updatedSubspacesJoined, 
                $inc: { subspacesJoinedCount: 1 } 
            }, { new: true });
            await Subspace.updateOne(
                { _id: subspace._id },
                {
                    $push: { members: user._id },
                    $inc: { membersCount: 1 }
                }
            );
            req.session.user.subspacesJoined = updatedSubspacesJoined;
            res.status(200).json({ user: req.session.user });
        } else if (action === "false") {
            let updatedSubspacesJoined = req.session.user.subspacesJoined;
            updatedSubspacesJoined = updatedSubspacesJoined.filter(subspace => subspace.name.replace(/ /g, "-") !== subspaceName);
            const user = await User.findOneAndUpdate({ email: email }, {
                subspacesJoined: updatedSubspacesJoined,
                $inc: { subspacesJoinedCount: -1 }
            }, { new: true });
            req.session.user.subspacesJoined = updatedSubspacesJoined;
            await Subspace.updateOne(
                { _id: subspace._id },
                {
                    $pull: { members: user._id },
                    $inc: { membersCount: -1 }
                }
            );
            res.status(200).json({ user: req.session.user });
        }
    } catch (error) { res.status(404).json({ message: "Network error. Try again." }) }
}

const fetchAllSubspaceInfo = async (req, res) => {
    try {
        const { subspaceName } = req.query;
        const subspace = await Subspace.findOne({ subspaceName: subspaceName });
        const posts = await Post.find({ subspaceId: subspace._id });
        res.status(200).json({ subspaceData: subspace, subspacePosts: posts });

    } catch (error) { res.status(404).json({ message: "Network error. Try again." }) }
}

const fetchSubspacePosts = async (req, res) => {
    try {
        const { subspaceName } = req.query;
        const subspace = await Subspace.findOne({ subspaceName: subspaceName });
        const posts = await Post.find({ subspaceId: subspace._id });
        res.status(200).json(posts);
    } catch (error) { res.status(404).json({ message: "Network error. Try again." }) }
}

export { createSubspace, joinSubspace, fetchAllSubspaceInfo, fetchSubspacePosts };