import { ThemeProvider, createTheme } from "@mui/material";
import { createContext, useMemo, useState, useEffect } from "react";

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
        if (selectedTheme && selectedTheme !== mode) {
            setMode(selectedTheme);
        }
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
    if (!isInitialized) {
        return null;
    }

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