import { ObjectId } from "mongodb";
import User from "../models/user.model.js";
import Join from "../models/join.model.js";
import Subspace from "../models/subspace.model.js";
import { uploadFile, deleteFromCloudinary } from "../utils/cloudinary.js";

const LIMIT = process.env.SUBSPACES_LIMIT || 4;

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

const fetchSubspaceInfo = async (req, res) => {
    try {
        const { subspaceName } = req.query;
        const isSubspaceDeleted = await Subspace.findOne({ subspaceName });
        if (isSubspaceDeleted?.isDeleted) return res.status(200).json(isSubspaceDeleted);

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
                    avatarURL: 1,
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
        if (subspace.length === 0) return res.status(404).json({ message: "No subspace found." });
        res.status(200).json(subspace[0]);
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const createSubspace = async (req, res) => {
    try {
        const tempSubspace = req.body;
        const subspace = { ...tempSubspace, subspaceName: tempSubspace.name.replace(/ /g, "-") };
        const isSubspaceNameUnique = await Subspace.findOne({ name: subspace.name });
        if (isSubspaceNameUnique) return res.status(409).json({ message: "Subspace with same name already exists" });

        const { _id } = req.user;
        const newSubspace = await Subspace.create(subspace);
        await Join.create({
            userId: _id,
            subspaceId: newSubspace._id
        });
        await User.findByIdAndUpdate(_id, { $inc: { subspacesJoined: 1 } });
        res.status(200).json(newSubspace);
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const uploadSubspaceAvatar = async (req, res) => {
    try {
        const { subspaceId, type } = req.body;
        let avatarURL;
        let avatarPublicId;
        if (type.toUpperCase() === "UPDATE") {
            const subspace = await Subspace.findById(subspaceId);
            if (!req.file?.buffer) {
                if (!subspace.avatarPublicId) return res.sendStatus(200);

                await Subspace.findByIdAndUpdate(subspaceId, { $unset: { avatarURL: "", avatarPublicId: "" } });
                const avatarDeleted = await deleteFromCloudinary(subspace.avatarPublicId);
                if (!avatarDeleted) console.error(`FileDeletionError: ${subspace.avatarPublicId}`);
                return res.sendStatus(200);
            }
            if (subspace.avatarPublicId) {
                const avatarDeleted = await deleteFromCloudinary(subspace.avatarPublicId);
                if (!avatarDeleted) console.error(`FileDeletionError: ${subspace.avatarPublicId}`);
            }
            if (req.file?.buffer) {
                const result = await uploadFile(req.file.buffer);
                if (result.url && result.public_id) {
                    avatarURL = result.url;
                    avatarPublicId = result.public_id;

                    await Subspace.findByIdAndUpdate(subspaceId, { avatarURL: avatarURL, avatarPublicId: avatarPublicId });
                }
            }
            return res.sendStatus(200);
        } else if (type.toUpperCase() === "CREATE") {
            if (req.file.buffer) {
                const result = await uploadFile(req.file.buffer);
                if (result.url && result.public_id) {
                    avatarURL = result.url;
                    avatarPublicId = result.public_id;

                    await Subspace.findByIdAndUpdate(subspaceId, { avatarURL: avatarURL, avatarPublicId: avatarPublicId });
                }
            }
            return res.sendStatus(200);
        }
        res.sendStatus(401);
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const isSubspaceJoined = async (req, res) => {
    try {
        const { subspaceId, userId } = req.query;
        const isJoined = await Join.findOne({ subspaceId: subspaceId, userId: userId });
        if (isJoined) return res.status(200).json(true);
        res.status(200).json(false);
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
        const { _id } = req.user;
        const { subspaceId, subspaceData } = req.body;
        const subspace = await Subspace.findById(subspaceId);
        if (!subspace.creator.equals(_id)) return res.status(409).json({ message: "Unauthorised access" });

        const updatedSubspaceData = { ...subspaceData, subspaceName: subspaceData.name.replace(/ /g, "-") };
        const isSubspaceNameUnique = await Subspace.findOne({ name: updatedSubspaceData.name });
        if (isSubspaceNameUnique && JSON.stringify(isSubspaceNameUnique) !== JSON.stringify(subspace)) {
            return res.status(409).json({ message: "Subspace with same name already exists." })
        }
        const updatedSubspace = await Subspace.findByIdAndUpdate(subspaceId, updatedSubspaceData, { new: true });
        res.status(200).json({ label: subspaceData.name.replace(/ /g, "-"), _id: updatedSubspace._id });
        // res.status(409).json({ message: "Testing Update" });
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }
}

const deleteSubspace = async (req, res) => {
    try {
        const { subspaceId } = req.query;
        const { _id } = req.user;
        const subspace = await Subspace.findByIdAndUpdate(subspaceId, {
            $unset: { description: "", avatarURL: "", avatarPublicId: "", creator: "", dateCreated: "", membersCount: "", topics: "", postsCount: "" },
            isDeleted: true,
        }, { returnOriginal: true });

        const wasSubspaceJoined = await Join.findOneAndDelete({ subspaceId: subspace._id, userId: _id });
        if (wasSubspaceJoined) {
            await User.findByIdAndUpdate(_id, { $inc: { subspacesJoined: -1 } });
        }

        if (subspace.avatarPublicId) {
            const avatarDeleted = await deleteFromCloudinary(subspace.avatarPublicId);
            if (!avatarDeleted) console.error(`FileDeletionError: ${subspace.avatarPublicId}`);
        }

        res.status(200).json({ label: subspace.subspaceName, _id: subspace._id });
    } catch (error) { res.status(503).json({ message: "Network error. Try again." }) }

}

export { fetchSubspaces, fetchSubspaceInfo, createSubspace, uploadSubspaceAvatar, isSubspaceJoined, joinSubspace, updateSubspace, deleteSubspace };