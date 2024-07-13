import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSession } from "../actions/user";

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
        async function fetchUser() {
            if (!user) {
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
                    } else if (status === 200) {
                        setUser(result);
                    }
                    setLoading(false);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        fetchUser();
    }, [dispatch, user, setSnackbarValue, setSnackbarState]);

    return { user, loading };
};

export default useFetchUser;