import { combineReducers } from "redux";
import posts from "./posts";
import user from "./user";

export const reducers = combineReducers({ posts, user });