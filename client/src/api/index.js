import axios from "axios";

axios.defaults.withCredentials = true;
const API = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

// User
export const fetchCondenseUserInfo = () => API.get("/user/session");
export const fetchUserInfo = (userName) => API.get("/user", { params: userName });
export const registerViaGoogle = (token) => API.post("/user/registerViaGoogle", token);
export const loginViaGoogle = (token) => API.post("/user/loginViaGoogle", token);
export const register = (authData) => API.post("/user/register", authData);
export const login = (authData) => API.post("/user/login", authData);
export const logout = () => API.patch("/user/logout");
export const updateProfile = (formData) => API.patch("/user/updateProfile", formData);
export const changePassword = (formData) => API.patch("/user/changePassword", formData);
export const deleteProfile = () => API.delete("/user/deleteProfile");

// Subspace
export const fetchSubspaces = (searchParams) => API.post("/subspace", searchParams);
export const fetchSubspaceInfo = (subspaceName) => API.get("/subspace/info", { params: subspaceName });
export const createSubspace = (subspaceData) => API.post("/subspace/create", subspaceData);
export const uploadSubspaceAvatar = (avatar) => API.post("/subspace/uploadAvatar", avatar, {
    headers: {
        "Content-Type": "multipart/form-data",
    }
});
export const isSubspaceJoined = (subspaceAndUserId) => API.get("/subspace/isJoined", { params: subspaceAndUserId });
export const joinSubspace = (actionData) => API.patch("/subspace/join", actionData);
export const updateSubspace = (subspaceData) => API.put("/subspace/update", subspaceData);
export const deleteSubspace = (subspaceId) => API.delete("/subspace/delete", { params: subspaceId });

// Post
export const fetchPosts = (searchParams) => API.post("/post/", searchParams);
export const fetchPostInfo = (postId) => API.get("/post/info", { params: postId });
export const createPost = (newPost) => API.post("/post/create", newPost);
export const uploadPostMedia = (media) => API.post("/post/uploadMedia", media, {
    headers: {
        "Content-Type": "multipart/form-data",
    }
});
export const isPostLiked = (postAndUserId) => API.get("/post/isLiked", { params: postAndUserId });
export const likePost = (actionData) => API.patch("/post/like", actionData);
export const updatePost = (postData) => API.put("/post/update", postData);
export const deletePost = (postId) => API.delete("/post/delete", { params: postId });

// Comment
export const fetchComments = (postId) => API.get("/comment/", { params: postId });
export const createComment = (newComment) => API.post("/comment/create", newComment);
export const fetchReplies = (postAndParentId) => API.get("/comment/reply/", { params: postAndParentId });
export const createReply = (newReply) => API.post("/comment/reply/create", newReply);
export const deleteComment = (commentId) => API.delete("/comment/delete", { params: commentId });