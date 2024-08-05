import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
// Importing actions
import { fetchUserSession, setUserSession } from "../actions/user";

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
                const { status, result } = await dispatch(fetchUserSession());
                if (status === 503) {
                    setUser(false);
                    setSnackbarValue({ message: "Server is down. Try again later.", status: "error" });
                    setSnackbarState(true);
                } else if (status === 404) {
                    setUser(false);
                } else if (status === 409) {
                    localStorage.removeItem("token");
                    setUser(false);
                    setSnackbarValue({ message: result.message, status: "error" });
                    setSnackbarState(true);
                } else if (status === 200) {
                    if (result?.user) {
                        setUser(result.user);
                    } else {
                        setUser(result);
                    }
                }
                setLoading(false);
            } catch (error) {
                setSnackbarValue({ message: "Server is down. Try again later.", status: "error" });
                setSnackbarState(true);
            }
        }
        async function fetchUserInfoFromLocalStorage() {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const tokenData = jwtDecode(token);
                    if (tokenData._id && tokenData.name && tokenData.userName && tokenData.email && tokenData.iat && tokenData.exp) {
                        setUser(tokenData);
                        setLoading(false);
                        await dispatch(setUserSession(tokenData));
                    } else {
                        fetchUserInfoFromDataBase();
                    }
                } catch (error) {
                    localStorage.removeItem("token");
                    setLoading(false);
                }
            } else {
                setUser(false);
                setLoading(false);
            }
        }
        if (!user) {
            fetchUserInfoFromLocalStorage();
        }
    }, [dispatch, user, setSnackbarValue, setSnackbarState]);

    return { user, loading };
};

export default useFetchUser;