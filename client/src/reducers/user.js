import { FETCH_USER_SESSION, AUTH, LOGOUT, UPDATE_PROFILE, CREATE_SUBSPACE, JOIN_SUBSPACE, DELETE_SUBSPACE } from "../constants/actionTypes";

const userReducers = (user = null, action) => {
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
        case CREATE_SUBSPACE:
            return action.payload;
        case JOIN_SUBSPACE:
            return action.payload;
        case DELETE_SUBSPACE:
            return action.payload;
        default:
            return user;
    }
};
export default userReducers;