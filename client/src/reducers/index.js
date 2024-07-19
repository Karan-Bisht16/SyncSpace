import { combineReducers } from "redux";
import user from "./user";
import subspaces from "./subspaces";

export const reducers = combineReducers({ user, subspaces });