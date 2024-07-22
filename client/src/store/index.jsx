import { ThemeProvider, createTheme } from "@mui/material";
import { createContext, useState, useEffect, useMemo } from "react";

export const ColorModeContext = createContext({
    toggleMode: () => { },
    mode: "dark",
});
const getDesignTokens = (mode) => ({
    palette: {
        mode,
        background: {
            ...(mode === "light"
                ? {
                    default: "#ffffff",
                    paper: "#ffffff",
                    backdrop: "#fafafa",
                    primary: "#0090c1",
                    secondary: "#ffffff",
                    tertiary: "#fefefe",
                }
                : {
                    default: "#1e2123",
                    paper: "#1e2123",
                    backdrop: "#333333",
                    primary: "#141414",
                    secondary: "#303234",
                    tertiary: "#303234",
                }
            )
        },
        text: {
            ...(mode === "light"
                ? {
                    primary: "#000000",
                    secondary: "#000000",
                    heading: "#0090c1",
                }
                : {
                    primary: "#EEF0F2",
                    secondary: "#ffffff",
                    heading: "#ffffff",
                }),
        },
        button: {
            ...(mode === "light"
                ? {
                    primary: "#ffffff",
                    secondary: "#0090c1",
                    tertiary: "#0090c1",
                }
                : {
                    primary: "#0090c1",
                    secondary: "#ffffff",
                    tertiary: "#303234",
                }),
        }
    },
});
export const ColorContextProvider = ({ children }) => {
    const [mode, setMode] = useState("dark");
    const [isInitialized, setIsInitialized] = useState(false);
    useEffect(() => {
        const selectedTheme = localStorage.getItem("selectedTheme");
        if (selectedTheme && selectedTheme !== mode) { setMode(selectedTheme) }
        setIsInitialized(true);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
            mode,
        }), [mode]
    );

    const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
    if (!isInitialized) { return null }

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export const ReRenderContext = createContext();
export const ReRenderProvider = ({ children }) => {
    const [reRender, setReRender] = useState(false);

    return (
        <ReRenderContext.Provider value={{ reRender, setReRender }}>
            {children}
        </ReRenderContext.Provider>
    );
};

export const ConfirmationDialogContext = createContext();
export const ConfirmationDialogProvider = ({ children }) => {
    const [dialog, setDialog] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        title: "",
        message: "",
        cancelBtnText: "",
        submitBtnText: "",
    });
    const [linearProgressBar, setLinearProgressBar] = useState(false);
    async function openDialog(values) {
        await setDialogValue(values);
        await setDialog(true);
        document.querySelector("#focusPostBtn").focus();
    };
    function closeDialog() {
        setDialog(false);
        setLinearProgressBar(false)
    };

    return (
        <ConfirmationDialogContext.Provider value={{ dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar }}>
            {children}
        </ConfirmationDialogContext.Provider>
    )
}

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