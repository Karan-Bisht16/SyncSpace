import { FETCH_USER_SESSION, AUTH, LOGOUT, UPDATE_PROFILE } from "../constants/actionTypes";

export default (user = null, action) => {
    switch (action.type) {
        case FETCH_USER_SESSION:
            return action.payload;
        case AUTH:
            localStorage.setItem("token", action.payload.token);
            return action.payload.user;
        case LOGOUT:
            localStorage.removeItem("token");
            return null;
        case UPDATE_PROFILE:
            return action.payload;
        default:
            return user;
    }
};