import React, { useState } from "react";
import { Box } from "@mui/material";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { square } from "ldrs";
// Importing my components
import SnackBar from "./Components/SnackBar/SnackBar";
import ProtectedRoute from "./utils/ProtectedRoute";
import GuestRoute from "./utils/GuestRoute";
import useFetchUser from "./utils/useFetchUser";
import Header from "./Components/Header/Header";
// Importing all webpages
import Home from "./pages/Home/Home";
import CreatePost from "./pages/CreatePost/CreatePost";
import CreateSubspace from "./pages/CreateSubspace/CreateSubspace";
import Subspace from "./pages/Subspace/Subspace";
import Account from "./pages/Account/Account";
import Settings from "./pages/Settings/Settings";
import Authentication from "./pages/Authentication/Authentication";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
// Importing styling for toggle theme [for body]
import "./styles.css";

function App() {
    square.register("l-main-loading");
    // JS for SnackBar
    const [snackbarState, setSnackbarState] = useState(false);
    const [snackbarValue, setSnackbarValue] = useState({ message: "", status: "" });
    function handleSnackbarState(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarState(false);
    }
    const { user, loading } = useFetchUser(setSnackbarValue, setSnackbarState);
    const loadingScreenStyling = {
        width: "100hw", height: "100vh", bgcolor: "background.default",
        display: "flex", justifyContent: "center", alignItems: "center",
    }

    if (loading) {
        return (
            <Box sx={loadingScreenStyling}>
                <l-main-loading size="75" stroke="5" stroke-length="0.25" bg-opacity="0.25" speed="1" color="#0090c1" />
            </Box>
        );
    }
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_API_TOKEN}>
            <Router>
                <Header user={user} setSnackbarState={setSnackbarState} setSnackbarValue={setSnackbarValue} />
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Home user={user} setSnackbarState={setSnackbarState} setSnackbarValue={setSnackbarValue} />}
                    />
                    <Route
                        path="/create-post"
                        element={<ProtectedRoute Component={CreatePost} user={user} setSnackbarState={setSnackbarState} setSnackbarValue={setSnackbarValue} />}
                    />
                    <Route
                        path="/create-subspace"
                        element={<ProtectedRoute Component={CreateSubspace} user={user} setSnackbarState={setSnackbarState} setSnackbarValue={setSnackbarValue} />}
                    />
                    <Route
                        path="/ss/:name"
                        element={<Subspace user={user} setSnackbarState={setSnackbarState} setSnackbarValue={setSnackbarValue} />}
                    />
                    <Route
                        path="/authentication"
                        element={<GuestRoute Component={Authentication} user={user} setSnackbarState={setSnackbarState} setSnackbarValue={setSnackbarValue} />}
                    />
                    <Route
                        path="/account"
                        element={<ProtectedRoute Component={Account} user={user} setSnackbarState={setSnackbarState} setSnackbarValue={setSnackbarValue} />}
                    />
                    <Route
                        path="/settings"
                        element={<ProtectedRoute Component={Settings} user={user} setSnackbarState={setSnackbarState} setSnackbarValue={setSnackbarValue} />}
                    />
                    <Route
                        path="*"
                        element={<PageNotFound />}
                    />
                </Routes>
            </Router>
            <SnackBar
                openSnackbar={snackbarState} handleClose={handleSnackbarState} timeOut={5000}
                message={snackbarValue.message} type={snackbarValue.status}
                sx={{ display: { xs: "none", sm: "flex" } }}
            />
            <SnackBar
                openSnackbar={snackbarState} handleClose={handleSnackbarState} timeOut={5000}
                message={snackbarValue.message} type={snackbarValue.status}
                vertical="top" horizontal="left"
                sx={{ display: { xs: "flex", sm: "none" } }}
            />
        </GoogleOAuthProvider>
    );
}

export default App;