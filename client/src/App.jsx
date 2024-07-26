import React, { useContext } from "react";
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
import Trending from "./pages/Trending/Trending";
import PostContainer from "./pages/PostContainer/PostContainer";
import Subspace from "./pages/Subspace/Subspace";
import Profile from "./pages/Profile/Profile";
import CreatePost from "./pages/CreatePost/CreatePost";
import EditPost from "./pages/EditPost/EditPost";
import CreateSubspace from "./pages/CreateSubspace/CreateSubspace";
import UpdateSubspace from "./pages/UpdateSubspace/UpdateSubspace";
import Settings from "./pages/Settings/Settings";
import Authentication from "./pages/Authentication/Authentication";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
// Importing contexts
import { SnackBarContext } from "./store";
// Importing styling for toggle theme [for body]
import "./styles.css";

function App() {
    square.register("l-main-loading");
    const queryClient = new QueryClient();

    const { snackbarValue, snackbarState, setSnackbarValue, setSnackbarState, handleSnackbarState } = useContext(SnackBarContext);
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
                        <Route exact path="/" element={<Home user={user} />} />
                        <Route path="/Trending" element={<Trending user={user} />} />
                        <Route path="/post/:id" element={<PostContainer user={user} />} />
                        <Route path="/ss/:subspaceName" element={<Subspace user={user} />} />
                        <Route path="/e/:userName" element={<Profile user={user} />} />
                        <Route
                            path="/create-post"
                            element={<ProtectedRoute Component={CreatePost} user={user} />}
                        />
                        <Route
                            path="/edit-post/:id"
                            element={<ProtectedRoute Component={EditPost} user={user} />}
                        />
                        <Route
                            path="/create-subspace"
                            element={<ProtectedRoute Component={CreateSubspace} user={user} />}
                        />
                        <Route
                            path="/ss/update/:subspaceName"
                            element={<ProtectedRoute Component={UpdateSubspace} user={user} />}
                        />
                        <Route
                            path="/authentication"
                            element={<GuestRoute Component={Authentication} user={user} />}
                        />
                        <Route
                            path="/settings"
                            element={<ProtectedRoute Component={Settings} user={user} />}
                        />
                        <Route path="*" element={<PageNotFound />} />
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