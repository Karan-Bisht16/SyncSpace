import axios from "axios";

axios.defaults.withCredentials = true;
const API = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("token")) {
        req.headers.authorization = localStorage.getItem("token");
    }
    return req;
});
// User
export const fetchUserSession = () => API.get("/user/session");
export const fetchUserInfo = () => API.get("/user/");
export const fetchUserPosts = () => API.get("/user/posts");
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
export const fetchSubspacePosts = (subspaceName) => API.get("/subspace/posts", { params: subspaceName });
// Post
export const fetchPosts = () => API.get("/posts");
export const createPost = (newPost) => API.post("/posts", newPost);

// 1st: api/index.js
// 2nd: actions/post.js
// 3rd: Form/Form.jsx [jaha par bhi dispatcher use karna h]
// 4th: reducers