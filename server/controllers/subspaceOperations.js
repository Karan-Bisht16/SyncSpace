import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import User from "../models/user.js";
import Join from "../models/join.js";
import Subspace from "../models/subspace.js";

const LIMIT = process.env.SUBSPACES_LIMIT || 4;

const fetchSubspaceInfo = async (req, res) => {
    try {
        const { subspaceName } = req.query;
        const isSubspaceDeleted = await Subspace.findOne({ subspaceName });
        if (isSubspaceDeleted?.isDeleted) { return res.status(200).json(isSubspaceDeleted) }
        const subspace = await Subspace.aggregate([
            { $match: { subspaceName: subspaceName } },
            {
                $lookup: {
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creatorDetails"
                }
            },
            { $unwind: "$creatorDetails" },
            {
                $project: {
                    name: 1,
                    subspaceName: 1,
                    membersCount: 1,
                    description: 1,
                    avatar: 1,
                    postsCount: 1,
                    dateCreated: 1,
                    topics: 1,
                    isDeleted: 1,
                    creator: 1,
                    "creatorDetails.userName": 1,
                    "creatorDetails.name": 1,
                    "creatorDetails.isDeleted": 1,
                }
            }
        ]);
        if (subspace.length === 0) {
            res.status(404).json({ message: "No subspace found." });
        } else {
            res.status(200).json(subspace[0]);
        }
    } catch (error) { console.log(error); res.status(503).json({ message: "Network error. Try again." }) }
}

const fetchSubspaces = async (req, res) => {
    try {
        const { pageParams, searchQuery } = req.body;
        const startIndex = (Number(pageParams) - 1) * LIMIT;
        const total = await Join.countDocuments(searchQuery);
        const subspaces = await Join.aggregate([
            { $match: { userId: new ObjectId(searchQuery.userId) } },
            { $sort: { _id: -1 } },
            { $skip: Number(startIndex) },
            { $limit: Number(LIMIT) },
            {
                $lookup: {
                    from: "subspaces",
                    localField: "subspaceId",
                    foreignField: "_id",
                    as: "subspaceDetails"
                }
            },
            { $unwind: "$subspaceDetails" },
            {
                $replaceRoot: { newRoot: "$subspaceDetails" }
            }
        ]);
        const currentPage = Number(pageParams);
        const count = Math.ceil(total / LIMIT);
        if (currentPage === 1) {
            if (total > LIMIT) {
                res.status(200).json({ count: count, previous: null, next: currentPage + 1, results: subspaces });
            } else {
                res.status(200).json({ count: count, previous: null, next: null, results: subspaces });
            }
        } else if (currentPage === count) {
            res.status(200).json({ count: count, previous: currentPage - 1, next: null, results: subspaces });
        } else {
            res.status(200).json({ count: count, previous: currentPage - 1, next: currentPage + 1, results: subspaces });
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const createSubspace = async (req, res) => {
    try {
        const tempSubspace = req.body;
        const subspace = { ...tempSubspace, subspaceName: tempSubspace.name.replace(/ /g, "-") };
        const isSubspaceNameUnique = await Subspace.findOne({ name: subspace.name });
        if (isSubspaceNameUnique) {
            res.status(409).json({ message: "Subspace with same name already exists." })
        } else {
            const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
            const user = await User.findOneAndUpdate({ email: email }, {
                $inc: { subspaceJoined: 1 }
            }, { new: true });
            const newSubspace = await Subspace.create(subspace);
            await Join.create({
                userId: user._id,
                subspaceId: newSubspace._id
            });
            res.status(200).json(newSubspace);
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const isSubspaceJoined = async (req, res) => {
    try {
        const { subspaceId, userId } = req.query;
        const isJoined = await Join.findOne({ subspaceId: subspaceId, userId: userId });
        if (isJoined) { res.status(200).json(true) }
        else { res.status(200).json(false) }
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const joinSubspace = async (req, res) => {
    try {
        const { subspaceId, userId, action } = req.body;
        let subspace;
        if (action) {
            subspace = await Subspace.findByIdAndUpdate(subspaceId, {
                $inc: { membersCount: 1 }
            }, { new: true });
            await User.findByIdAndUpdate(userId, { $inc: { subspacesJoined: 1 } })
            await Join.create({ subspaceId: subspaceId, userId: userId });
        } else {
            subspace = await Subspace.findByIdAndUpdate(subspaceId, {
                $inc: { membersCount: -1 }
            }, { new: true });
            await User.findByIdAndUpdate(userId, { $inc: { subspacesJoined: -1 } })
            await Join.findOneAndDelete({ subspaceId: subspaceId, userId: userId });
        }
        res.status(200).json({ joinedSubspace: { label: subspace.subspaceName, _id: subspace._id }, joined: action });
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const updateSubspace = async (req, res) => {
    try {
        const { _id } = jwt.decode(req.headers.authorization.split(" ")[1]);
        const { subspaceId, subspaceData } = req.body;
        const subspace = await Subspace.findById(subspaceId);
        if (subspace.creator.equals(_id)) {
            const updatedSubspaceData = { ...subspaceData, subspaceName: subspaceData.name.replace(/ /g, "-") };
            const isSubspaceNameUnique = await Subspace.findOne({ name: updatedSubspaceData.name });
            if (isSubspaceNameUnique && JSON.stringify(isSubspaceNameUnique) !== JSON.stringify(subspace)) {
                res.status(409).json({ message: "Subspace with same name already exists." })
            } else {
                const updatedSubspace = await Subspace.findByIdAndUpdate(subspaceId, updatedSubspaceData, { new: true });
                res.status(200).json({ label: subspaceData.name.replace(/ /g, "-"), _id: updatedSubspace._id });
            }
        } else {
            res.status(409).json({ message: "Unauthorised access" });
        }
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }

}

const deleteSubspace = async (req, res) => {
    try {
        const { subspaceId } = req.query;
        const { email } = jwt.decode(req.headers.authorization.split(" ")[1]);
        const subspace = await Subspace.findByIdAndUpdate(subspaceId, {
            $unset: { description: "", avatar: "", creator: "", dateCreated: "", membersCount: "", topics: "", postsCount: "" },
            isDeleted: true,
        }, { returnOriginal: true });
        const user = await User.findOneAndUpdate({ email: email }, {
            $inc: { subspacesJoined: -1 }
        }, { new: true });
        await Join.findOneAndDelete({ subspaceId: subspace._id, userId: user._id });
        res.status(200).json({ label: subspace.subspaceName, _id: subspace._id });
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }

}

export { fetchSubspaceInfo, fetchSubspaces, createSubspace, isSubspaceJoined, joinSubspace, updateSubspace, deleteSubspace };