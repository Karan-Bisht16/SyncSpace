import { FETCH_CONDENSE_USER_INFO, AUTH, LOGOUT, UPDATE_PROFILE } from "../constants/actionTypes";

export default (user = null, action) => {
    switch (action.type) {
        case FETCH_CONDENSE_USER_INFO:
            return action.payload;
        case AUTH:
            return action.payload;
        case LOGOUT:
            return null;
        case UPDATE_PROFILE:
            return action.payload;
        default:
            return user;
    }
};