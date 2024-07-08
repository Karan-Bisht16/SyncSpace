import { FETCH_USER_SESSION, AUTH, LOGOUT, JOIN_SUBSPACE } from "../constants/actionTypes";

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
        case JOIN_SUBSPACE:
            const { _id, name, membersCount } = action.payload;
            let tempUser = JSON.parse(JSON.stringify(user));
            tempUser.subspacesJoined.push({ _id: _id, name: name, membersCount: membersCount });
            return tempUser;
        default:
            return user;
    }
};