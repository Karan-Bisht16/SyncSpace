import { FETCH_SUBSPACES, CREATE_SUBSPACE, JOIN_SUBSPACE, DELETE_SUBSPACE } from "../constants/actionTypes";

export default (subspaces = [], action) => {
    switch (action.type) {
        case FETCH_SUBSPACES:
            const joinedSubspaces = action.payload;
            const newSubspaces = joinedSubspaces.map(subspace => {
                return { label: subspace.subspaceName, _id: subspace._id };
            });
            const subspacesJoinedArray = subspaces.concat(newSubspaces);
            if (subspacesJoinedArray.length === 0) {
                return [];
            } else {
                return [...new Map(subspacesJoinedArray.map(item => [item["_id"], item])).values()];
            }
        case CREATE_SUBSPACE:
            const createdSubspace = action.payload;
            return [...subspaces, { label: createdSubspace.subspaceName, _id: createdSubspace._id }];
        case JOIN_SUBSPACE:
            const { joinedSubspace, joined } = action.payload;
            if (joined) {
                return [...subspaces, joinedSubspace];
            } else {
                return subspaces.filter(subspace => subspace._id !== joinedSubspace._id);
            }
        case DELETE_SUBSPACE:
            const deletedSubspace = action.payload;
            return subspaces.filter(subspace => subspace._id !== deletedSubspace._id);
        default:
            return subspaces;
    }
};