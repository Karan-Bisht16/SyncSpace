import * as api from "../api";
import { CREATE_POST } from "../constants/actionTypes";

function handleError(error) {
    if (error.code === "ERR_NETWORK") {
        return { status: 503, result: { message: "Server is down. Please try again later." } };
    } else {
        return { status: error.response.status, result: error.response.data };
    }
}

// export const getPosts = () => async (dispatch) => {
//     try {
//         const { data } = await api.getPosts();
//         dispatch({ type: FETCH_ALL_POST, payload: data });
//         return { status: 200, result: data }
//     } catch (error) { return handleError(error) }
// };

export const fetchPostInfo = (postId) => async () => {
    try {
        const { data } = await api.fetchPostInfo(postId);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const fetchPosts = (searchParams) => async () => {
    try {
        const { data } = await api.fetchPosts(searchParams);
        // dispatch({ type: FETCH_LIMITED_POSTS, payload: data.results });
        return data;
    } catch (error) { return handleError(error) }
};

export const createPost = (postData) => async (dispatch) => {
    try {
        const { data } = await api.createPost(postData);
        dispatch({ type: CREATE_POST, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
};