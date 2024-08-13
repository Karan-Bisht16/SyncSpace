import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// Importing actions
import { fetchCondenseUserInfo } from "../actions/user";

const useFetchUser = (setSnackbarValue, setSnackbarState) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const useSelectorUser = useSelector((state) => state.user);

    useEffect(() => {
        if (useSelectorUser) {
            setUser(useSelectorUser);
            setLoading(false);
        }
    }, [useSelectorUser]);

    useEffect(() => {
        async function fetchUserInfoFromDataBase() {
            try {
                const { status, result } = await dispatch(fetchCondenseUserInfo());
                if (status === 200) {
                    setUser(result);
                } else {
                    if (status === 503) {
                        setSnackbarValue({ message: "Server is down. Try again later.", status: "error" });
                        setSnackbarState(true);
                    } else if (status === 409) {
                        setSnackbarValue({ message: result.message, status: "error" });
                        setSnackbarState(true);
                    }
                    setUser(false);
                }
                setLoading(false);
            } catch (error) {
                setSnackbarValue({ message: "Server is down. Try again later.", status: "error" });
                setSnackbarState(true);
            }
        }
        if (!user) {
            fetchUserInfoFromDataBase();
        }
    }, [user, setSnackbarValue, setSnackbarState, dispatch]);

    return { user, loading };
};

export default useFetchUser;