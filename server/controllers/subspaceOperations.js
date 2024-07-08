import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Subspace from "../models/subspace.js";

const createSubspace = async (req, res) => {
    try {
        const subspace = req.body;
        const isSubspaceNameUnique = await Subspace.findOne({ name: subspace.name });
        if (isSubspaceNameUnique) {
            res.send(409).json({ message: "Subspace already exists." })
        } else {
            const newSubspace = new Subspace(subspace);
            const { email } = jwt.decode(req.headers.authorization);
            await newSubspace.save();
            let updatedSubspacesJoined = req.session.user.subspacesJoined;
            updatedSubspacesJoined = [...updatedSubspacesJoined, { _id: newSubspace._id, name: newSubspace.name, membersCount: newSubspace.membersCount }];
            await User.findOneAndUpdate({ email: email }, { subspacesJoined: updatedSubspacesJoined })
            req.session.user.subspacesJoined = updatedSubspacesJoined;
            res.status(201).json(newSubspace);
        }
    } catch (error) {
        console.log("Creating subspace failed: " + error);
        res.status(409).json({ message: "Network error. Try again." });
    }
}

const joinSubspace = async (req, res) => {
    try {
        console.log(req.query);
        console.log(req.headers.authorization);
        res.status(200).json({ message: "Head empty, No thoughts!" });
    } catch (error) {
        console.log("Joining subspace failed :" + error);
        res.status(404).json({ message: "Network error. Try again." });
    }
}

export { createSubspace, joinSubspace };