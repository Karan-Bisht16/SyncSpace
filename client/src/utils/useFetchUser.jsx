import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserSession } from "../actions/user";

const useFetchUser = (setSnackbarFunction) => {
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
                        setSnackbarFunction(true);
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
    }, [dispatch, user, setSnackbarFunction]);

    return { user, loading };
};

export default useFetchUser;