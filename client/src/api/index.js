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
export const logout = () => API.delete("/user/logout");
export const updateProfile = (formData) => API.patch("/user/updateProfile", formData);
export const changePassword = (formData) => API.patch("/user/changePassword", formData);
export const deleteProfile = () => API.delete("/user/deleteProfile");

// Subspace
export const createSubspace = (subspaceData) => API.post("/subspace", subspaceData);
export const joinSubspace = (actionData) => API.get("/subspace/join", { params: actionData });
export const fetchAllSubspaceInfo = (subspaceName) => API.get("/subspace/info", { params: subspaceName });
export const fetchSubspaceAvatar = (subspaceName) => API.get("/subspace/avatar", { params: subspaceName });

// Post
export const fetchPostInfo = (postId) => API.get(`/posts?id=${postId}`);
export const fetchPosts = (searchParams) => API.post("/posts/", searchParams);
export const createPost = (newPost) => API.post("/posts/createPost", newPost);
export const deletePost = (postId) => API.get(`/posts/deletePost?id=${postId}`);