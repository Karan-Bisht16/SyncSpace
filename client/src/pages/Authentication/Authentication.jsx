import React, { useState, useEffect, useRef, useContext } from "react";
import { Avatar, Box, Button, Container, Grid, Paper, Typography, TextField, LinearProgress } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing contexts
import { SnackBarContext } from "../../store/index";
// Importing my components
import InputField from "../../Components/InputField/InputField";
// Importing actions
import { getGoogleUser, createGoogleUser, signUp, signIn } from "../../actions/user";
// Importing styling
import styles from "./styles";

function Authentication() {
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "SyncSpace: Authentication";
    }, []);

    const nameField = useRef(null);
    const emailField = useRef(null);
    const passwordField = useRef(null);
    const confirmPasswordField = useRef(null);
    const regexEmail = /^([a-zA-Z0-9_\.\-]+)@([a-zA-Z0-9_\.\-]+)\.([a-zA-Z]+)/;
    // JS for Form Dialog
    const [openDialog, setOpenDialog] = useState(false);
    function handleClickOpenDialog() {
        setOpenDialog(true);
        setUniqueUserNameError(false);
    };
    function handleCloseDialog() {
        setOpenDialog(false);
    };
    const [authData, setAuthData] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        confirmPassword: "",
    });
    const [isSignUp, setIsSignUp] = useState(true);
    function handleIsSignUp() {
        setIsSignUp(prevIsSignUp => {
            return !prevIsSignUp;
        });
        emailField.current.focus();
    }
    const [uniqueUserNameError, setUniqueUserNameError] = useState(false);
    function handleChange(event) {
        const { name, value } = event.target;
        setAuthData(prevAuthData => {
            return { ...prevAuthData, [name]: value };
        });
    }
    const [showUserPassword, setShowUserPassword] = useState("password");
    function handleShowUserPassword(event) {
        setShowUserPassword(prevShowUserPassword => {
            return prevShowUserPassword === "password" ? "text" : "password";
        });
    }
    const [showConfirmPassword, setShowConfirmPassword] = useState("password");
    function handleShowConfirmPassword() {
        setShowConfirmPassword(prevShowConfirmPassword => {
            return prevShowConfirmPassword === "password" ? "text" : "password";
        });
        passwordField.current.focus();
    }
    const [googleToken, setGoogleToken] = useState(null);
    async function googleSuccessFunction(response) {
        if (response.credential) {
            setGoogleToken(response.credential);
            const { status, result } = await dispatch(getGoogleUser({ token: response.credential }));
            if (status === 200) {
                navigate("/", { state: { status: "success", message: "Sign in successful!", time: new Date().getTime() } })
            } else if (status === 409) {
                handleClickOpenDialog();
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        }
    }
    const [linearProgressBar, setLinearProgressBar] = useState(false);
    async function handleUserDialog(event) {
        event.preventDefault();
        setLinearProgressBar(true);
        const token = googleToken;
        const { status, result } = await dispatch(createGoogleUser({ token: token, name: authData.userName }));
        if (status === 200) {
            navigate("/", { state: { status: "success", message: "Sign in successful!", time: new Date().getTime() } })
        } else if (status === 400) {
            setUniqueUserNameError(true);
            setLinearProgressBar(false);
        } else {
            setSnackbarValue({ message: result.message, status: "error" });
            setSnackbarState(true);
        }
    }
    function googleErrorFunction() {
        setSnackbarValue({ message: "Server side error. Try again.", status: "error" });
        setSnackbarState(true);
    }
    async function handleSubmit(event) {
        event.preventDefault();
        if (isSignUp && authData.userName.trim() === "") {
            nameField.current.focus();
            return false;
        }
        if (authData.userEmail.trim() === "") {
            emailField.current.focus();
            return false;
        } else if (!regexEmail.test(authData.userEmail.trim())) {
            setSnackbarValue({ message: "Invalid e-mail.", status: "error" });
            setSnackbarState(true);
            return false;
        }
        if (authData.userPassword.trim() === "") {
            passwordField.current.focus();
            return false;
        }
        if (!isSignUp) {
            if (authData.confirmPassword.trim() === "") {
                confirmPasswordField.current.focus();
                return false;
            } else if (authData.confirmPassword.trim() !== authData.userPassword.trim()) {
                setSnackbarValue({ message: "Passwords do not match.", status: "error" });
                setSnackbarState(true);
                return false;
            }
        }
        if (isSignUp) {
            const { status, result } = await dispatch(signUp(authData));
            if (status === 200) {
                navigate("/", { state: { status: "success", message: "Sign up successful!", time: new Date().getTime() } })
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
                return false;
            }
        } else {
            const { status, result } = await dispatch(signIn(authData));
            if (status === 200) {
                navigate("/", { state: { status: "success", message: "Sign in successful!", time: new Date().getTime() } })
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
                return false;
            }
        }
    }

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <Container sx={classes.subContainer}>
                    <Paper elevation={3}>
                        <Box sx={classes.title}>
                            <Avatar><LockOutlined /></Avatar>
                            <Typography variant="h5">{isSignUp ? "Sign Up" : "Sign In"}</Typography>
                        </Box>
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container sx={classes.formContainer}>
                                {isSignUp && (
                                    <Grid item xs={10} sm={7}>
                                        <InputField
                                            name={"userName"} label={"Username"} type={"text"} value={authData.userName}
                                            handleChange={handleChange} reference={nameField} autoFocus={true}
                                            sx={{ display: { xs: "none", sm: "block" } }}
                                        />
                                        <InputField
                                            name={"userName"} label={"Username"} type={"text"} value={authData.userName}
                                            handleChange={handleChange} reference={nameField} autoFocus={false}
                                            sx={{ display: { xs: "block", sm: "none" } }}
                                        />
                                    </Grid>
                                )}
                                <Grid item xs={10} sm={7}>
                                    <InputField
                                        name={"userEmail"} label={"E-mail"} type={"email"} value={authData.userEmail}
                                        handleChange={handleChange} reference={emailField}
                                    />
                                </Grid>
                                <Grid item xs={10} sm={7}>
                                    <InputField
                                        name={"userPassword"} label={"Password"} type={showUserPassword} value={authData.userPassword}
                                        handleChange={handleChange} reference={passwordField} id={"password"}
                                    />
                                </Grid>
                                <Grid item xs={1} sx={classes.showPasswordGrid}>
                                    <button type="button" style={classes.showPasswordBtn} onClick={handleShowUserPassword}>{showUserPassword === "password" ? <Visibility /> : <VisibilityOff />}</button>
                                </Grid>
                                {!isSignUp &&
                                    <>
                                        <Grid item xs={10} sm={7}>
                                            <InputField
                                                name={"confirmPassword"} label={"Confirm Password"} type={showConfirmPassword} value={authData.confirmPassword}
                                                handleChange={handleChange} reference={confirmPasswordField} id={"password"}
                                            />
                                        </Grid>
                                        <Grid item xs={1} sx={classes.showPasswordGrid}>
                                            <button type="button" style={classes.showPasswordBtn} onClick={handleShowConfirmPassword}>{showConfirmPassword === "password" ? <Visibility /> : <VisibilityOff />}</button>
                                        </Grid>
                                    </>
                                }
                                <Grid item xs={10} sm={7} sx={classes.bottomGroup}>
                                    <Button type="submit" fullWidth variant="contained" sx={classes.signBtn}>{isSignUp ? "Sign Up" : "Sign in"}</Button>
                                    <Box sx={classes.boxBottomGroup}>
                                        <hr style={{ width: "100%" }}></hr>
                                        <Box sx={classes.positionalOr}>
                                            <span>or</span>
                                        </Box>
                                    </Box>
                                    <Box sx={{ ...classes.boxBottomGroup, padding: "8px 0" }}>
                                        <GoogleLogin
                                            onSuccess={googleSuccessFunction}
                                            onError={googleErrorFunction}
                                            cookiePolicy="single_host_origin"
                                        />
                                    </Box>
                                </Grid>
                                <Typography sx={classes.linkContainer}>
                                    {isSignUp ?
                                        <>Already have an account? <span onClick={handleIsSignUp} style={classes.toggleLink}> Sign in</span></>
                                        : <>Don't have an account? <span onClick={handleIsSignUp} style={classes.toggleLink}> Sign Up</span></>
                                    }
                                </Typography>
                            </Grid>
                        </form>
                    </Paper>
                </Container>
            </Box>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                PaperProps={{
                    component: "form",
                    onSubmit: (event) => {
                        event.preventDefault();
                        handleCloseDialog();
                    },
                }}
            >
                <DialogTitle>Username</DialogTitle>
                <LinearProgress sx={{ opacity: linearProgressBar ? "1" : "0" }} />
                <DialogContent>
                    <DialogContentText>
                        Enter a unique username to continue.
                    </DialogContentText>
                    {uniqueUserNameError ?
                        <TextField
                            id="name" name="userName" label="Username" type="text" onChange={handleChange}
                            margin="dense" variant="standard" autoComplete="off" autoFocus required fullWidth
                            error helperText="Username not available"
                        />
                        :
                        <TextField
                            id="name" name="userName" label="Username" type="text" onChange={handleChange}
                            margin="dense" variant="standard" autoComplete="off" autoFocus required fullWidth
                        />
                    }
                </DialogContent>
                <DialogActions sx={{ marginTop: uniqueUserNameError ? "" : "19.9125px" }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" type="submit" onClick={handleUserDialog}>Enter</Button>
                </DialogActions>
            </Dialog>
        </Grid >
    );
}

export default Authentication;