import { createContext, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing contexts
import { SnackBarContext } from "./SnackBar.context";
// Importing actions
import { fetchUserInfo } from "../actions/user";

export const UserDataContext = createContext();
export const UserDataProvider = (props) => {
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const dispatch = useDispatch();

    const [primaryLoading, setPrimaryLoading] = useState(true);
    const [secondaryLoading, setSecondaryLoading] = useState(true);
    const [noUserFound, setNoUserFound] = useState(false);
    const [userProfileDeleted, setUserProfileDeleted] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        name: "Loading...",
        userName: "Loading...",
        email: "Loading...",
        bio: "Loading...",
        dateJoined: "Loading...",
        avatar: "",
        credits: "Loading...",
        subspacesJoined: "Loading...",
        postsCount: "Loading...",
    });
    const [userPostsCount, setUserPostsCount] = useState(0);

    const fetchAllUserInfo = async (userName, setFormData) => {
        const { user } = props;
        if (user.userName === userName) {
            setUpdatedUser(user);
            setPrimaryLoading(false);
        }
        const { status, result } = await dispatch(fetchUserInfo({ userName: userName }));
        if (status === 200) {
            if (result.isDeleted) {
                setUserProfileDeleted(true);
            } else {
                setUpdatedUser(result);
                setUserPostsCount(result.postsCount);
                setFormData({
                    name: result.name,
                    bio: result.bio,
                    email: result.email,
                });
            }
            setPrimaryLoading(false);
            setSecondaryLoading(false);
        } else if (status === 404) {
            setPrimaryLoading(false);
            setSecondaryLoading(false);
            setNoUserFound(true);
        } else {
            setSnackbarValue({ message: result.message, status: "error" });
            setSnackbarState(true);
        }
    }

    return (
        <UserDataContext.Provider value={{
            fetchAllUserInfo, updatedUser, setUpdatedUser, primaryLoading, secondaryLoading,
            noUserFound, userProfileDeleted, userPostsCount
        }}>
            <Outlet />
        </UserDataContext.Provider>
    )
}