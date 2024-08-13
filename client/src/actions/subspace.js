import * as api from "../api";
import { FETCH_SUBSPACES, CREATE_SUBSPACE, JOIN_SUBSPACE, DELETE_SUBSPACE } from "../constants/actionTypes";

function handleError(error) {
    if (error.code === "ERR_NETWORK") {
        return { status: 503, result: { message: "Server is down. Please try again later." } };
    } else {
        return { status: error.response.status, result: error.response.data };
    }
}

export const fetchSubspaces = (searchParams) => async (dispatch) => {
    try {
        const { data } = await api.fetchSubspaces(searchParams);
        dispatch({ type: FETCH_SUBSPACES, payload: data.results });
        return data;
    } catch (error) { return handleError(error) }
}

export const fetchSubspaceInfo = (subspaceName) => async () => {
    try {
        const { data } = await api.fetchSubspaceInfo(subspaceName);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const createSubspace = (subspaceData) => async (dispatch) => {
    try {
        const { data } = await api.createSubspace(subspaceData);
        dispatch({ type: CREATE_SUBSPACE, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const uploadSubspaceAvatar = (avatar) => async () => {
    const { data } = await api.uploadSubspaceAvatar(avatar);
    return { status: 200, result: data };
}

export const isSubspaceJoined = (subspaceAndUserId) => async () => {
    try {
        const { data } = await api.isSubspaceJoined(subspaceAndUserId);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const joinSubspace = (actionData) => async (dispatch) => {
    try {
        const { data } = await api.joinSubspace(actionData);
        dispatch({ type: JOIN_SUBSPACE, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error); }
}

export const updateSubspace = (subspaceData) => async () => {
    try {
        const { data } = await api.updateSubspace(subspaceData);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const deleteSubspace = (subspaceId) => async (dispatch) => {
    try {
        const { data } = await api.deleteSubspace(subspaceId);
        dispatch({ type: DELETE_SUBSPACE, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}