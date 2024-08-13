import * as api from "../api";

function handleError(error) {
    if (error.code === "ERR_NETWORK") {
        return { status: 503, result: { message: "Server is down. Please try again later." } };
    } else {
        return { status: error.response.status, result: error.response.data };
    }
}

export const fetchComments = (postId) => async () => {
    try {
        const { data } = await api.fetchComments(postId);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const createComment = (commentData) => async () => {
    try {
        const { data } = await api.createComment(commentData);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const deleteComment = (commentId) => async () => {
    try {
        const { data } = await api.deleteComment(commentId);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const fetchReplies = (postAndParentId) => async () => {
    try {
        const { data } = await api.fetchReplies(postAndParentId);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const createReply = (replyData) => async () => {
    try {
        const { data } = await api.createReply(replyData);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}