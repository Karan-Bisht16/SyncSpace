import * as api from "../api";
import { CREATE_SUBSPACE, JOIN_SUBSPACE, DELETE_SUBSPACE } from "../constants/actionTypes";

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
        dispatch({ type: CREATE_SUBSPACE, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
};

export const joinSubspace = (actionData) => async (dispatch) => {
    try {
        const { data } = await api.joinSubspace(actionData);
        dispatch({ type: JOIN_SUBSPACE, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error); }
};

export const fetchAllSubspaceInfo = (subspaceName) => async () => {
    try {
        const { data } = await api.fetchAllSubspaceInfo(subspaceName);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
};

export const fetchSubspaceAvatar = (subspaceName) => async () => {
    try {
        const { data } = await api.fetchSubspaceAvatar(subspaceName);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const deleteSubspace = (subspaceName) => async (dispatch) => {
    try {
        const { data } = await api.deleteSubspace(subspaceName);
        dispatch({ type: DELETE_SUBSPACE, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}