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
// I think working but not sure
export const fetchUserSession = () => API.get("/user/session");
export const fetchUserInfo = () => API.get("/user/");
// working
export const fetchUserPosts = () => API.get("/user/posts");
// can only try after proper deployment
export const getGoogleUser = (token) => API.get("/user/getGoogleUser", { params: token });
export const createGoogleUser = (token) => API.get("/user/createGoogleUser", { params: token });
// working
export const signUp = (authData) => API.post("/user/signUp", authData);
export const signIn = (authData) => API.post("/user/signIn", authData);
export const logout = () => API.delete("/user/logout");
// error on deployment otherwise working
export const updateProfile = (formData) => API.patch("/user/updateProfile", formData);
// working
export const changePassword = (formData) => API.patch("/user/changePassword", formData);
export const deleteProfile = () => API.delete("/user/deleteProfile");
// Subspace
// not working on deployment: req.session is undefined, thus can't join as well
export const createSubspace = (subspaceData) => API.post("/subspace", subspaceData);
// not working on deployment: req.session is undefined
export const joinSubspace = (actionData) => API.get("/subspace/join", { params: actionData });
// working
export const fetchAllSubspaceInfo = (subspaceName) => API.get("/subspace/info", { params: subspaceName });
export const fetchSubspacePosts = (subspaceName) => API.get("/subspace/posts", { params: subspaceName });

// Post
// working
export const fetchPosts = () => API.get("/posts");
export const createPost = (newPost) => API.post("/posts", newPost);

// 1st: api/index.js
// 2nd: actions/post.js
// 3rd: Form/Form.jsx [jaha par bhi dispatcher use karna h]
// 4th: reducers