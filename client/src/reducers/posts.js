import { FETCH_ALL_POST, CREATE_POST } from "../constants/actionTypes";

export default (posts = [], action) => {
    switch (action.type) {
        case FETCH_ALL_POST:
            return action.payload;
        case CREATE_POST:
            return [...posts, action.payload];
        default:
            return posts;
    }
};