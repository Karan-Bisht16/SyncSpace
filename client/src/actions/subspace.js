import * as api from "../api";
import { JOIN_SUBSPACE } from "../constants/actionTypes";

function handleError(error) {
    if (error.code === "ERR_NETWORK") {
        return { status: 503, result: { message: "Server is down. Please try again later." } };
    } else {
        return { status: error.response.status, result: error.response.data };
    }
}

export const createSubspace = (subspaceData) => async (dispatch) => {
    try {
        const { data } = await api.createSubspace(subspaceData);
        dispatch({ type: JOIN_SUBSPACE, payload: data.user });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
};

export const joinSubspace = (actionData) => async (dispatch) => {
    try {
        const { data } = await api.joinSubspace(actionData);
        dispatch({ type: JOIN_SUBSPACE, payload: data.user });
        return { status: 200, result: data };
    } catch (error) { return handleError(error); }
};

export const fetchAllSubspaceInfo = (subspaceName) => async () => {
    try {
        const { data } = await api.fetchAllSubspaceInfo(subspaceName);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
};

export const fetchSubspacePosts = (subspaceName) => async () => {
    try {
        const { data } = await api.fetchSubspacePosts(subspaceName);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}