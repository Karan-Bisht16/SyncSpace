import React, { useState } from "react";
import { Box } from "@mui/material";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
// Importing my components
import SnackBar from "./Components/SnackBar/SnackBar";
import ProtectedRoute from "./utils/protectedRoute";
import GuestRoute from "./utils/guestRoute";
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
import { square } from 'ldrs';

function App() {
    const [snackbar, setSnackbar] = useState(false);
    function handleSnackbar(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setSnackbar(false);
    }
    square.register('l-square');
    const { user, loading } = useFetchUser(setSnackbar);
    const loadingScreenStyling = {
        width: "100hw",
        height: "100vh",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }

    if (loading) {
        return (
            <Box sx={loadingScreenStyling}>
                <l-square size="75" stroke="5" stroke-length="0.25" bg-opacity="0.25" speed="1" color="#0090c1" />
            </Box>
        );
    }
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_API_TOKEN}>
            <Router>
                <Header user={user} />
                {/* Defining all possible routes */}
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Home user={user} />}
                    />
                    <Route
                        path="/create-post"
                        element={<ProtectedRoute Component={CreatePost} user={user} />}
                    />
                    <Route
                        path="/create-subspace"
                        element={<ProtectedRoute Component={CreateSubspace} user={user} />}
                    />
                    <Route
                        path="/ss/:name"
                        element={<Subspace user={user} />}
                    />
                    <Route
                        path="/authentication"
                        element={<GuestRoute Component={Authentication} user={user} />}
                    />
                    <Route
                        path="/account"
                        element={<ProtectedRoute Component={Account} user={user} />}
                    />
                    <Route
                        path="/settings"
                        element={<ProtectedRoute Component={Settings} user={user} />}
                    />
                    <Route
                        path="*"
                        element={<PageNotFound />}
                    />
                </Routes>
            </Router>
            <SnackBar openSnackbar={snackbar} handleClose={handleSnackbar} timeOut={5000} message="Server is down. Try again later." type="error" />
        </GoogleOAuthProvider>
    );
}

export default App;