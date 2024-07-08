import React, { useState, useEffect, useRef } from "react";
import { Typography, Box, Grid, Avatar, LinearProgress } from "@mui/material";
import { CloseRounded, ModeEdit } from "@mui/icons-material";
import { useDispatch } from "react-redux";
// Importing my components
import Posts from "../../Components/Posts/Posts";
import SnackBar from "../../Components/SnackBar/SnackBar";
import ProfileBar from "../../Components/ProfileBar/ProfileBar";
import InputField from "../../Components/InputField/InputField";
// Importing actions
import { fetchUserInfo, fetchUserPosts } from "../../actions/user";
// Importing styling
import styles from "./styles";

// [CRUD] subspaces, Render posts, 
// delete, update posts, 
// [Update and delete] user, profile users, followers
// repost? terminology space related

function Account() {
    const classes = styles();
    const dispatch = useDispatch();
    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace";
        // dispatch(getUserPosts());
    }, []);

    const nameField = useRef(null);
    const emailField = useRef(null);
    const bioField = useRef(null);
    // JS for SnackBar
    const [snackbarState, setSnackbarState] = useState(false);
    const [snackbarValue, setSnackbarValue] = useState({ message: "", status: "" });
    function handleSnackbarState(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarState(false);
    }
    const [editProfile, setEditProfile] = useState(false);
    function handleEditProfile() {
        setEditProfile(prevEditProfile => {
            return !prevEditProfile;
        })
    }
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
    });
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => {
            return { ...prevFormData, [name]: value }
        });
    }
    // Fetching user info
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getUserInfo() {
            if (!user) {
                try {
                    const { status, result } = await dispatch(fetchUserInfo());
                    const resultUser = result;
                    if (status === 200) {
                        setUser(resultUser);
                        document.title = "SyncSpace: s/" + resultUser.name;
                        setFormData({
                            name: resultUser.name,
                            email: resultUser.email,
                            bio: resultUser.bio,
                        });
                        const { status, result } = await dispatch(fetchUserPosts());
                        const resultPosts = result;
                        if (status === 200) {
                            setUserPosts(resultPosts);
                        } else {
                            setSnackbarValue({ message: resultPosts.message, status: "error" });
                            setSnackbarState(true);
                        }
                    } else {
                        setUser(false);
                        setSnackbarValue({ message: resultUser.message, status: "error" });
                        setSnackbarState(true);
                    }
                    setLoading(false);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        getUserInfo();
    }, [dispatch, user]);
    function userPostsBlock(userPosts) {
        if (userPosts.length === 0) {
            return (
                <Box sx={classes.noContentContainer}>
                    <Typography sx={classes.titleFont}>You haven't posted anything</Typography>
                </Box>
            );
        }
        return (
            <Posts posts={userPosts} />
        );
    }

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                {loading ?
                    <Box sx={classes.loadingScreenStyling}>
                        <Typography sx={classes.titleFont}>Fetching user information</Typography>
                        <LinearProgress sx={classes.progressBar} />
                    </Box>
                    :
                    <div>
                        <Box sx={classes.heading}>
                            <Box sx={classes.userContainer}>
                                <Avatar sx={classes.userAvatar} alt={user.name} src={user.avatar}>{user.name.charAt(0)}</Avatar>
                                <Box>
                                    <Typography sx={classes.userName}>{user.name}</Typography>
                                    <p style={{ fontSize: "14px", margin: "0" }}>s/{user.userName}</p>
                                </Box>
                            </Box>
                            <Box sx={classes.editProfile} onClick={handleEditProfile}>
                                {!editProfile ?
                                    <>
                                        <ModeEdit sx={{ display: { xs: "flex", sm: "none" } }} />
                                        <Typography sx={{ display: { xs: "none", sm: "flex" } }}>Edit Profile</Typography>
                                    </>
                                    :
                                    <>
                                        <CloseRounded sx={{ display: { xs: "flex", sm: "none" } }} />
                                        <Typography sx={{ display: { xs: "none", sm: "flex" } }}>Cancel</Typography>
                                    </>
                                }
                            </Box>
                        </Box>
                        {!editProfile ?
                            <div>
                                <Grid container sx={classes.subContainer}>
                                    <Grid item md={8.75} sx={Object.assign({ display: { xs: "none", lg: "block" } }, classes.postContainer)}>
                                        {userPostsBlock(userPosts)}
                                    </Grid>
                                    <Grid item md={0.25}></Grid>
                                    <ProfileBar user={user} userPosts={userPosts} />
                                </Grid>
                                <Box sx={Object.assign({ display: { xs: "block", lg: "none" } }, classes.postContainer)}>
                                    {userPostsBlock(userPosts)}
                                </Box>
                            </div>
                            :
                            <Box>
                                <form noValidate>
                                    <InputField
                                        name="name" label="Name" value={formData.name} type="text" handleChange={handleChange} reference={nameField}
                                    />
                                    <InputField
                                        name="email" label="Email" value={formData.email} type="text" handleChange={handleChange} reference={emailField}
                                    />
                                    <InputField
                                        name="bio" label="Bio" value={formData.bio} type="text" handleChange={handleChange} reference={bioField}
                                    />
                                </form>
                            </Box>
                        }
                    </div>
                }
            </Box>
            <SnackBar openSnackbar={snackbarState} handleClose={handleSnackbarState} timeOut={5000} message={snackbarValue.message} type={snackbarValue.status} />
        </Grid>
    );
}

export default Account;