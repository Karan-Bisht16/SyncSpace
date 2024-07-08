import * as api from "../api";
import { JOIN_SUBSPACE } from "../constants/actionTypes";

function handleError(error) {
    if (error.code === "ERR_NETWORK") {
        return { status: 503, result: { message: "Server is down. Please try again later." } };
    } else {
        return { status: error.response.status, result: error.response.data };
    }
}

export const fetchSubspaceInfo = () => async (dispatch) => {
    try {
        // const { data } = await api.fetchPosts();
        // dispatch({ type: FETCH_ALL_POST, payload: data });
    } catch (error) {
        handleError(error);
    }
};

export const createSubspace = (subspaceData) => async (dispatch) => {
    try {
        const { data } = await api.createSubspace(subspaceData);
        dispatch({ type: JOIN_SUBSPACE, payload: data });
        return { status: 200, result: data };
    } catch (error) {
        handleError(error);
    }
};

export const joinSubspace = () => async () => {
    try {
        const { data } = await api.joinSubspace();
        return { status: 200, result: data };
    } catch (error) {
        console.log(error);
        handleError(error);
    }
};