import React, { useState, useContext, useEffect, useCallback } from "react";
import { AppBar, Typography, Button, Box, Drawer, Toolbar, IconButton, CssBaseline } from "@mui/material";
import { Menu, Add } from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing my components
import SnackBar from "../SnackBar/SnackBar";
import ToolBar from "../ToolBar/ToolBar";
import CustomDrawer from "./CustomDrawer/CustomDrawer";
import { ColorModeContext } from "../../store";
// Importing actions
import { logoutUser } from "../../actions/user";
// Importing styling
import styles from "./styles";
// Importing images
import SyncSpaceLogo from "../../assets/img-syncspace-logo.avif";

function Header(props) {
    const { user } = props;
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // JS for Snackbar
    const [snackbarState, setSnackbarState] = useState(false);
    const [snackbarValue, setSnackbarValue] = useState({ message: "", status: "" });
    function handleSnackbarState(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarState(false);
    }
    // JS for Toggle Theme
    const { mode, toggleMode } = useContext(ColorModeContext);
    function setDarkMode() {
        document.querySelector("body").setAttribute("data-theme", "dark");
    }
    function setLightMode() {
        document.querySelector("body").setAttribute("data-theme", "light");
    }
    const toggleBodyTheme = useCallback((themeValue) => {
        if (themeValue === "dark") {
            setDarkMode();
        } else {
            setLightMode();
        }
    }, []);
    function handleToggleMode() {
        const newMode = mode === "light" ? "dark" : "light";
        localStorage.setItem("selectedTheme", newMode);
        toggleMode();
        toggleBodyTheme(newMode);
    };
    // JS for SideBar
    const drawerWidth = "275px";
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    function handleDrawerClose() {
        setIsClosing(true);
        setMobileOpen(false);
    };
    function handleDrawerTransitionEnd() {
        setIsClosing(false);
    };
    function handleDrawerToggle() {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };
    async function handleLogout() {
        const { status, result } = await dispatch(logoutUser());
        if (status === 200) {
            navigate("/");
            window.location.reload();
        } else {
            navigate("/", { state: { status: "error", message: result.message } });
        }
    }
    useEffect(() => {
        const selectedTheme = localStorage.getItem("selectedTheme");
        toggleBodyTheme(selectedTheme);
        if (selectedTheme && selectedTheme !== mode) {
            toggleMode();
        }
        if (location.state && location.state.status) {
            setSnackbarState(true);
            setSnackbarValue({ message: location.state.message, status: location.state.status });
        }
    }, [mode, toggleBodyTheme, toggleMode, location.state]);

    return (
        <>
            <AppBar sx={classes.appBar}>
                <div style={classes.flexContainer}>
                    <Toolbar sx={classes.sideBar}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ display: { md: "none" } }}
                        >
                            <Menu />
                        </IconButton>
                    </Toolbar>
                    <Box component={Link} to="/" sx={classes.logoTitle}>
                        <img style={classes.logo} src={SyncSpaceLogo} alt="Logo of SyncSpace"></img>
                        <Typography align="center" variant="h5" sx={{ color: "white", display: { xs: "none", sm: "flex" } }}>SyncSpace</Typography>
                    </Box>
                </div>
                {user ?
                    <Box sx={classes.flexContainer}>
                        <Button component={Link} to="/create-post" variant="contained"
                            sx={Object.assign({ display: { xs: "none", sm: "flex" } }, classes.createPostBtn)}
                        >+ Create</Button>
                        <Button component={Link} to="/create-post" variant="contained"
                            sx={Object.assign({ display: { xs: "flex", sm: "none" } }, classes.createPostBtn, classes.createPostBtnXS)}
                        ><Add /></Button>
                        <ToolBar
                            mode={mode}
                            user={user}
                            handleToggleMode={handleToggleMode}
                            handleLogout={handleLogout}
                        />
                    </Box>
                    :
                    <Button component={Link} to="/authentication" variant="contained" sx={classes.createPostBtn} >Sign Up</Button>
                }
            </AppBar >
            <Box sx={classes.flexContainer}>
                <CssBaseline />
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        ModalProps={{ keepMounted: true }}
                        sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
                    >
                        <CustomDrawer user={user} handleDrawerClose={handleDrawerClose} />
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
                        open
                    >
                        <CustomDrawer user={user} handleDrawerClose={handleDrawerClose} />
                    </Drawer>
                </Box>
                <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}` } }}>
                    <Toolbar />
                </Box>
            </Box>
            <SnackBar openSnackbar={snackbarState} handleClose={handleSnackbarState} timeOut={5000} message={snackbarValue.message} type={snackbarValue.status} />
        </>
    );
}

export default Header;