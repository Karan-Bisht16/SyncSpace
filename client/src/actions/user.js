import * as api from "../api";
import { FETCH_USER_SESSION, AUTH, LOGOUT } from "../constants/actionTypes";

function handleError(error) {
    if (error.code === "ERR_NETWORK") {
        return { status: 503, result: { message: "Server is down. Please try again later." } };
    } else {
        return { status: error.response.status, result: error.response.data };
    }
}

export const fetchUserSession = () => async (dispatch) => {
    try {
        const { data } = await api.fetchUserSession();
        dispatch({ type: FETCH_USER_SESSION, payload: data });
        return { status: 200, result: data };
    } catch (error) {
        return handleError(error);
    }
};

export const fetchUserInfo = () => async () => {
    try {
        const { data } = await api.fetchUserInfo();
        return { status: 200, result: data };
    } catch (error) {
        return handleError(error);
    }
}

export const fetchUserPosts = () => async () => {
    try {
        const { data } = await api.fetchUserPosts();
        return { status: 200, result: data };
    } catch (error) {
        return handleError(error);
    }
}

export const getGoogleUser = (token) => async (dispatch) => {
    try {
        const { data } = await api.getGoogleUser(token);
        dispatch({ type: AUTH, payload: data });
        return { status: 200, result: data.user };
    } catch (error) {
        return handleError(error);
    }
};

export const createGoogleUser = (token) => async (dispatch) => {
    try {
        const { data } = await api.createGoogleUser(token);
        dispatch({ type: AUTH, payload: data });
        return { status: 200, result: data.user };
    } catch (error) {
        return handleError(error);
    }
};

export const signUp = (authData) => async (dispatch) => {
    try {
        const { data } = await api.signUp(authData);
        dispatch({ type: AUTH, payload: data });
        return { status: 200, result: data.user };
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            return { status: 503, result: { message: "Server is down. Please try again later." } };
        } else {
            return { status: error.response.status, result: error.response.data };
        }
    }
};

export const signIn = (authData) => async (dispatch) => {
    try {
        const { data } = await api.signIn(authData);
        dispatch({ type: AUTH, payload: data });
        return { status: 200, result: data.user };
    } catch (error) {
        return handleError(error);
    }
};

export const logoutUser = () => async (dispatch) => {
    try {
        const { data } = await api.logout();
        dispatch({ type: LOGOUT, payload: data });
        return { status: 200, result: data };
    } catch (error) {
        return handleError(error);
    }
};