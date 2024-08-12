import * as api from "../api";
import { FETCH_CONDENSE_USER_INFO, AUTH, LOGOUT, UPDATE_PROFILE } from "../constants/actionTypes";

function handleError(error) {
    if (error.code === "ERR_NETWORK") {
        return { status: 503, result: { message: "Server is down. Please try again later." } };
    } else {
        return { status: error.response.status, result: error.response.data };
    }
}

export const fetchCondenseUserInfo = () => async (dispatch) => {
    try {
        const { data } = await api.fetchCondenseUserInfo();
        dispatch({ type: FETCH_CONDENSE_USER_INFO, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const fetchUserInfo = (userName) => async () => {
    try {
        const { data } = await api.fetchUserInfo(userName);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const registerViaGoogle = (token) => async (dispatch) => {
    try {
        const { data } = await api.registerViaGoogle(token);
        dispatch({ type: AUTH, payload: data });
        return { status: 200, result: data.user };
    } catch (error) { return handleError(error) }
}

export const loginViaGoogle = (token) => async (dispatch) => {
    try {
        const { data } = await api.loginViaGoogle(token);
        dispatch({ type: AUTH, payload: data });
        return { status: 200, result: data.user };
    } catch (error) { return handleError(error) }
}

export const register = (authData) => async (dispatch) => {
    try {
        const { data } = await api.register(authData);
        dispatch({ type: AUTH, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const login = (authData) => async (dispatch) => {
    try {
        const { data } = await api.login(authData);
        dispatch({ type: AUTH, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const logoutUser = () => async (dispatch) => {
    try {
        const { data } = await api.logout();
        dispatch({ type: LOGOUT });
        return { status: 200, result: data.message };
    } catch (error) { return handleError(error) }
}

export const updateProfile = (formData) => async (dispatch) => {
    try {
        const { data } = await api.updateProfile(formData);
        dispatch({ type: UPDATE_PROFILE, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const changePassword = (formData) => async () => {
    try {
        const { data } = await api.changePassword(formData);
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}

export const deleteProfile = () => async (dispatch) => {
    try {
        const { data } = await api.deleteProfile();
        dispatch({ type: LOGOUT, payload: data });
        return { status: 200, result: data };
    } catch (error) { return handleError(error) }
}