import * as api from "../api";
import { FETCH_ALL_POST, CREATE_POST } from "../constants/actionTypes";

function handleError(error) {
    if (error.code === "ERR_NETWORK") {
        return { status: 503, result: { message: "Server is down. Please try again later." } };
    } else {
        return { status: error.response.status, result: error.response.data };
    }
}

export const getPosts = () => async (dispatch) => {
    try {
        const { data } = await api.fetchPosts();
        dispatch({ type: FETCH_ALL_POST, payload: data });
    } catch (error) {
        handleError(error);
    }
};

export const createPost = (postData) => async (dispatch) => {
    try {
        const { data } = await api.createPost(postData);
        dispatch({ type: CREATE_POST, payload: data });
        return { status: 200, result: data };
    } catch (error) {
        handleError(error);
    }
};