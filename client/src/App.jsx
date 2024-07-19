import React, { useState } from "react";
import { Box } from "@mui/material";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { square } from "ldrs";
// Importing my components
import SnackBar from "./Components/SnackBar/SnackBar";
import ProtectedRoute from "./utils/ProtectedRoute";
import GuestRoute from "./utils/GuestRoute";
import Header from "./Components/Header/Header";
import useFetchUser from "./utils/useFetchUser";
// Importing all webpages
import Home from "./pages/Home/Home";
import CreatePost from "./pages/CreatePost/CreatePost";
import PostContainer from "./pages/PostContainer/PostContainer";
import CreateSubspace from "./pages/CreateSubspace/CreateSubspace";
import UpdateSubspace from "./pages/UpdateSubspace/UpdateSubspace";
import Subspace from "./pages/Subspace/Subspace";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Authentication from "./pages/Authentication/Authentication";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
// Importing styling for toggle theme [for body]
import "./styles.css";

function App() {
    square.register("l-main-loading");
    const queryClient = new QueryClient();
    // JS for SnackBar
    const [snackbarState, setSnackbarState] = useState(false);
    const [snackbarValue, setSnackbarValue] = useState({ message: "", status: "" });
    function handleSnackbarState(event, reason) {
        if (reason === "clickaway") { return}
        setSnackbarState(false);
    }
    // JS for Confirmation Dialog
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
    // Fetching user
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
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Header user={user} snackbar={[setSnackbarValue, setSnackbarState]} />
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={
                                <Home
                                    user={user}
                                    snackbar={[setSnackbarValue, setSnackbarState]}
                                    confirmationDialog={[dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar]}
                                />
                            }
                        />
                        <Route
                            path="/create-post"
                            element={
                                <ProtectedRoute
                                    Component={CreatePost} user={user}
                                    snackbar={[setSnackbarValue, setSnackbarState]}
                                    confirmationDialog={[dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar]}
                                />
                            }
                        />
                        <Route
                            exact
                            path="/post/:id"
                            element={
                                <PostContainer
                                    user={user}
                                    snackbar={[setSnackbarValue, setSnackbarState]}
                                    confirmationDialog={[dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar]}
                                />
                            }
                        />
                        <Route
                            path="/create-subspace"
                            element={
                                <ProtectedRoute
                                    Component={CreateSubspace} user={user}
                                    snackbar={[setSnackbarValue, setSnackbarState]}
                                    confirmationDialog={[dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar]}
                                />
                            }
                        />
                        <Route
                            path="/ss/update/:subspaceName"
                            element={
                                <ProtectedRoute
                                    Component={UpdateSubspace} user={user}
                                    snackbar={[setSnackbarValue, setSnackbarState]}
                                    confirmationDialog={[dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar]}
                                />
                            }
                        />
                        <Route
                            path="/ss/:subspaceName"
                            element={
                                <Subspace
                                    user={user}
                                    snackbar={[setSnackbarValue, setSnackbarState]}
                                    confirmationDialog={[dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar]}
                                />
                            }
                        />
                        <Route
                            path="/authentication"
                            element={
                                <GuestRoute
                                    Component={Authentication} user={user}
                                    snackbar={[setSnackbarValue, setSnackbarState]}
                                />
                            }
                        />
                        <Route
                            path="/e/:userName"
                            element={
                                <Profile
                                    user={user}
                                    snackbar={[setSnackbarValue, setSnackbarState]}
                                    confirmationDialog={[dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar]}
                                />
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute
                                    Component={Settings} user={user}
                                    snackbar={[setSnackbarValue, setSnackbarState]}
                                    confirmationDialog={[dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar]}
                                />
                            }
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
                    openSnackbar={snackbarState} handleClose={handleSnackbarState} timeOut={2500}
                    message={snackbarValue.message} type={snackbarValue.status}
                    vertical="top" horizontal="left"
                    sx={{ display: { xs: "flex", sm: "none" } }}
                />
            </QueryClientProvider>
        </GoogleOAuthProvider>
    );
}

export default App;