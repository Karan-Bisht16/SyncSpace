import * as api from "../api";

function handleError(error) {
    if (error.code === "ERR_NETWORK") {
        return { status: 503, result: { message: "Server is down. Please try again later." } };
    } else {
        return { status: error.response.status, result: error.response.data };
    }
}

export const fetchPostInfo = (postId) => async () => {
    try {
        const { data } = await api.fetchPostInfo(postId);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const fetchPosts = (searchParams) => async () => {
    try {
        const { data } = await api.fetchPosts(searchParams);
        return data;
    } catch (error) { return handleError(error) }
};

export const createPost = (postData) => async () => {
    try {
        const { data } = await api.createPost(postData);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
};

export const isPostLiked = (postAndUserId) => async () => {
    try {
        const { data } = await api.isPostLiked(postAndUserId);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const likePost = (actionData) => async () => {
    try {
        const { data } = await api.likePost(actionData);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const updatePost = (postData) => async () => {
    try {
        const { data } = await api.updatePost(postData);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
};

export const deletePost = (postId) => async () => {
    try {
        const { data } = await api.deletePost(postId);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
};