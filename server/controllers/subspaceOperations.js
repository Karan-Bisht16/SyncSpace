import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Subspace from "../models/subspace.js";
import { createUserSession } from "../utils/functions.js";

const createSubspace = async (req, res) => {
    try {
        const tempSubspace = req.body;
        const subspace = { ...tempSubspace, subspaceName: tempSubspace.name.replace(/ /g, "-") };
        const isSubspaceNameUnique = await Subspace.findOne({ name: subspace.name });
        if (isSubspaceNameUnique) {
            res.status(409).json({ message: "Subspace already exists." })
        } else {
            const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
            const newSubspace = await Subspace.create(subspace);
            const newSubspaceObj = {
                subspaceId: newSubspace._id,
                name: newSubspace.name,
                description: newSubspace.description,
                avatar: newSubspace.avatar,
            };
            const user = await User.findOneAndUpdate({ email: email }, {
                $push: { subspacesJoined: newSubspaceObj },
                $inc: { subspacesJoinedCount: 1 }
            }, { new: true });
            if (req.session.user) {
                req.session.user.subspacesJoined = [...req.session.subspacesJoined, newSubspaceObj];
                res.status(200).json(req.session.user);
            } else {
                res.status(200).json(createUserSession(user));
            }
        }
    } catch (error) { res.status(404).json({ message: "Network error. Try again." }) }
}

const joinSubspace = async (req, res) => {
    try {
        const { action, subspaceName } = req.query;
        const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
        const subspace = await Subspace.findOne({ subspaceName: subspaceName });
        if (action === "true") {
            const newSubspaceObj = {
                subspaceId: subspace._id,
                name: subspace.name,
                description: subspace.description,
                avatar: subspace.avatar,
            };
            const user = await User.findOneAndUpdate({ email: email }, {
                $push: { subspacesJoined: newSubspaceObj },
                $inc: { subspacesJoinedCount: 1 }
            }, { new: true });
            await Subspace.updateOne({ _id: subspace._id }, {
                $push: { members: user._id },
                $inc: { membersCount: 1 }
            });
            if (req.session.user) {
                req.session.user.subspacesJoined = [...req.session.subspacesJoined, newSubspaceObj];
                res.status(200).json(req.session.user);
            } else {
                res.status(200).json(createUserSession(user));
            }
        } else if (action === "false") {
            const newSubspaceObj = {
                subspaceId: subspace._id,
                name: subspace.name,
                description: subspace.description,
                avatar: subspace.avatar,
            };
            const user = await User.findOneAndUpdate({ email: email }, {
                $pull: { subspacesJoined: newSubspaceObj },
                $inc: { subspacesJoinedCount: -1 }
            }, { new: true });
            await Subspace.updateOne({ _id: subspace._id }, {
                $pull: { members: user._id },
                $inc: { membersCount: -1 }
            });
            if (req.session.user) {
                req.session.user.subspacesJoined = req.session.user.subspacesJoined.filter(subspace => subspace.name.replace(/ /g, "-") !== subspaceName);
                res.status(200).json(req.session.user);
            } else {
                res.status(200).json(createUserSession(user));
            }
        }
    } catch (error) { res.status(404).json({ message: "Network error. Try again." }) }
}

const fetchAllSubspaceInfo = async (req, res) => {
    try {
        const { subspaceName } = req.query;
        const subspace = await Subspace.findOne({ subspaceName: subspaceName });
        res.status(200).json({ subspaceData: subspace, subspacePostsCount: subspace.postsCount });
    } catch (error) { res.status(404).json({ message: "Network error. Try again." }) }
}

const fetchSubspaceAvatar = async (req, res) => {
    try {
        const { subspaceName } = req.query;
        const subspace = await Subspace.findOne({ subspaceName: subspaceName });
        res.status(200).json({ subspaceAvatar: subspace.avatar });

    } catch (error) { res.status(404).json({ message: "Network error. Try again." }) }
}

export { createSubspace, joinSubspace, fetchAllSubspaceInfo, fetchSubspaceAvatar };