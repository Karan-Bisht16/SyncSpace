import { createContext, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing contexts
import { SnackBarContext } from "./SnackBar.context";
// Importing actions
import { fetchSubspaceInfo, isSubspaceJoined } from "../actions/subspace";

export const SubspaceDataContext = createContext();
export const SubspaceDataProvider = (props) => {
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const dispatch = useDispatch();

    const [subspaceData, setSubspaceData] = useState(null);
    const [primaryLoading, setPrimaryLoading] = useState(true);
    const [secondaryLoading, setSecondaryLoading] = useState(true);
    const [noSubspaceFound, setNoSubspaceFound] = useState(false);
    const [canModifySubspace, setCanModifySubspace] = useState(false);
    const [subspaceDeleted, setSubspaceDeleted] = useState(false);
    const [subspacePostsCount, setSubspacePostsCount] = useState(0);
    const [joined, setJoined] = useState(false);

    const fetchAllSubspaceInfo = async (subspaceName) => {
        const { user } = props;
        const { status, result } = await dispatch(fetchSubspaceInfo({ subspaceName }));
        if (status === 200) {
            const subspace = result;
            if (subspace.isDeleted) { setSubspaceDeleted(true) }
            else {
                setSubspaceData(subspace);
                if (user) {
                    if (user._id === subspace.creator) { setCanModifySubspace(true) }
                    const { status, result } = await dispatch(isSubspaceJoined({ userId: user._id, subspaceId: subspace._id }));
                    if (status === 200) { setJoined(result) }
                }
                setSubspacePostsCount(subspace.postsCount);
            }
            setPrimaryLoading(false);
            setSecondaryLoading(false);
        } else if (status === 404) {
            setPrimaryLoading(false);
            setSecondaryLoading(false);
            setNoSubspaceFound(true);
        } else {
            setSnackbarValue({ message: result.message, status: "error" });
            setSnackbarState(true);
        }
    }

    return (
        <SubspaceDataContext.Provider value={{
            fetchAllSubspaceInfo, subspaceData, primaryLoading, secondaryLoading, noSubspaceFound, subspaceDeleted,
            canModifySubspace, subspacePostsCount, joined, setJoined
        }}>
            <Outlet />
        </SubspaceDataContext.Provider>
    )
}