import axios from "axios";

axios.defaults.withCredentials = true;
const API = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("token")) {
        req.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
    }
    return req;
});

// User
export const fetchUserSession = () => API.get("/user/session");
export const fetchUserInfo = (userName) => API.get("/user", { params: userName });
export const getGoogleUser = (token) => API.get("/user/getGoogleUser", { params: token });
export const createGoogleUser = (token) => API.get("/user/createGoogleUser", { params: token });
export const signUp = (authData) => API.post("/user/signUp", authData);
export const signIn = (authData) => API.post("/user/signIn", authData);
export const updateProfile = (formData) => API.patch("/user/updateProfile", formData);
export const changePassword = (formData) => API.patch("/user/changePassword", formData);
export const deleteProfile = () => API.delete("/user/deleteProfile");

// Subspace
export const fetchSubspaces = (searchParams) => API.post("/subspace", searchParams);
export const fetchSubspaceInfo = (subspaceName) => API.get("/subspace/info", { params: subspaceName });
export const createSubspace = (subspaceData) => API.post("/subspace/create", subspaceData);
export const isSubspaceJoined = (subspaceAndUserId) => API.get("/subspace/isJoined", { params: subspaceAndUserId });
export const joinSubspace = (actionData) => API.patch("/subspace/join", actionData);
export const updateSubspace = (subspaceData) => API.put("/subspace/update", subspaceData);
export const deleteSubspace = (subspaceId) => API.delete("/subspace/delete", { params: subspaceId });

// Post
export const fetchPosts = (searchParams) => API.post("/post/", searchParams);
export const fetchPostInfo = (postId) => API.get("/post/info", { params: postId });
export const createPost = (newPost) => API.post("/post/create", newPost);
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