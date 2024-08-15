import { createContext, useState } from "react";

export const SnackBarContext = createContext();
export const SnackBarProvider = ({ children }) => {
    const [snackbarState, setSnackbarState] = useState(false);
    const [snackbarValue, setSnackbarValue] = useState({ message: "", status: "" });
    function handleSnackbarState(event, reason) {
        if (reason === "clickaway") { return }
        setSnackbarState(false);
    }

    return (
        <SnackBarContext.Provider value={{ snackbarValue, snackbarState, setSnackbarValue, setSnackbarState, handleSnackbarState }}>
            {children}
        </SnackBarContext.Provider>
    )
}