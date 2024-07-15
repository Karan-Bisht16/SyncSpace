import React, { useState, useEffect, useRef } from "react";
import { Avatar, Box, Button, Divider, Grid, LinearProgress, Typography } from "@mui/material";
import { CloseRounded, ModeEdit } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
// Importing my components
import RealTimeProfileViwer from "./RealTimeProfileViewer/RealTimeProfileViewer";
import InputField from "../../Components/InputField/InputField";
import ProfileBar from "../../Components/ProfileBar/ProfileBar";
import Posts from "../../Components/Posts/Posts";
// Importing actions
import { fetchUserInfo, updateProfile } from "../../actions/user";
// Importing styling
import styles from "./styles";
import NotFound from "../../Components/NotFound/NotFound";

function Profile(props) {
    const { user, setSnackbarValue, setSnackbarState } = props;
    const { userName } = useParams();
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace: e/" + userName;
    });

    const nameField = useRef(null);
    const emailField = useRef(null);
    const bioField = useRef(null);
    // Fetching user info
    const [primaryLoading, setPrimaryLoading] = useState(true);
    const [secondaryLoading, setSecondaryLoading] = useState(true);
    const [noUserFound, setNoUserFound] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({
        name: "Loading...",
        userName: "Loading...",
        email: "Loading...",
        bio: "Loading...",
        dateJoined: "Loading...",
        avatar: "",
        credits: "Loading...",
        subspacesJoined: [],
        subspacesJoinedCount: "Loading...",
        postsCount: "Loading...",
    });
    const [userPostsCount, setUserPostsCount] = useState(0);
    useEffect(() => {
        async function getUserInfo() {
            const { status, result } = await dispatch(fetchUserInfo({ userName: userName }));
            if (status === 200) {
                setUpdatedUser(result);
                setPrimaryLoading(false);
                setUserPostsCount(result.postsCount)
                setSecondaryLoading(false);
            } else if (status === 404) {
                setPrimaryLoading(false);
                setSecondaryLoading(false);
                setNoUserFound(true);
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        }
        async function getUser() {
            if (user.userName === userName) {
                setUpdatedUser(user);
                setPrimaryLoading(false);
                getUserInfo();
            } else {
                getUserInfo();
            }
        }
        getUser();
    }, [user, userName, dispatch, setSnackbarValue, setSnackbarState]);

    function userPostsBlock() {
        return (
            <>
                {secondaryLoading ?
                    <Box sx={classes.secondaryLoadingScreenStyling}>
                        <l-loader size="75" speed="1.75" color="#0090c1" />
                    </Box>
                    :
                    <>
                        {userPostsCount === 0 ?

                            <Box sx={classes.noContentContainer}>
                                <NotFound mainText="You haven't posted anything" />
                            </Box>
                            :
                            <Posts searchQuery={{ authorId: updatedUser._id }} setSnackbarValue={setSnackbarValue} setSnackbarState={setSnackbarState} />
                        }
                    </>
                }
            </>
        );
    }
    const [editProfile, setEditProfile] = useState(false);
    function handleEditProfile() {
        setEditProfile(prevEditProfile => {
            return !prevEditProfile;
        })
    }
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        email: "",
    });
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => {
            return { ...prevFormData, [name]: value }
        });
    }
    // Clear Form
    function handleClear() {
        setFormData(prevFormData => {
            return { ...prevFormData, "name": "", "bio": "" }
        });
    }
    // Submit Form
    async function handleSubmit(event) {
        event.preventDefault();
        if (formData.name.trim() === "") {
            nameField.current.focus();
            return false;
        }
        try {
            const { status, result } = await dispatch(updateProfile(formData));
            if (status === 200) {
                setEditProfile(false);
                setUpdatedUser(prevUser => {
                    return { ...prevUser, name: formData.name, userName: formData.name.replace(/ /g, "-"), bio: formData.bio }
                });
                navigate(`/e/${userName}`, { state: { message: "Account updated successfully!", status: "success" } });
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        } catch (error) {
            setSnackbarValue({ message: error.message, status: "error" });
            setSnackbarState(true);
        }
    }

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                {noUserFound ?
                    <NotFound
                        img={true}
                        mainText="No user found"
                        link={{ linkText: "Go home", to: "/", state: {} }}
                    />
                    :
                    <>
                        {primaryLoading ?
                            <Box sx={classes.primaryLoadingScreenStyling}>
                                <Typography sx={classes.titleFont}>Fetching user information</Typography>
                                <LinearProgress sx={classes.progressBar} />
                            </Box>
                            :
                            <>
                                <Box sx={classes.heading}>
                                    <Box sx={classes.userContainer}>
                                        <Avatar sx={classes.userAvatar} alt={updatedUser.name} src={updatedUser.avatar}>{updatedUser.name.charAt(0)}</Avatar>
                                        <Box>
                                            <Typography sx={classes.userName}>{updatedUser.name}</Typography>
                                            <p style={{ fontSize: "14px", margin: "0" }}>e/{updatedUser.userName}</p>
                                        </Box>
                                    </Box>
                                    {((user) && (user.userName === userName)) &&
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
                                    }
                                </Box>
                                {((user) && (user.userName === userName) && (editProfile)) ?
                                    <>
                                        <Grid container sx={classes.subContainer}>
                                            <Grid item xs={12} lg={8.75} sx={classes.postContainer}>
                                                <Box>
                                                    <Typography variant="h5" sx={classes.titleField}>Update Profile</Typography>
                                                    <form noValidate onSubmit={handleSubmit}>
                                                        <InputField
                                                            name="name" label="Name" value={formData.name} type="text"
                                                            handleChange={handleChange} reference={nameField} autoFocus={true}
                                                            sx={{ display: { xs: "none", sm: "flex" } }}
                                                        />
                                                        <InputField
                                                            name="name" label="Name" value={formData.name} type="text"
                                                            handleChange={handleChange} reference={nameField} autoFocus={false}
                                                            sx={{ display: { xs: "flex", sm: "none" } }}
                                                        />
                                                        <InputField
                                                            name="bio" label="Bio" value={formData.bio} type="text"
                                                            handleChange={handleChange} reference={bioField} multiline={true} rows={2}
                                                        />
                                                        <Box sx={{ margin: "16px 0" }}>
                                                            <Button variant="outlined" onClick={handleClear} sx={classes.clearBtn}>Clear</Button>
                                                            <Button type="submit" variant="contained" onClick={handleSubmit} sx={classes.updateBtn}>Update</Button>
                                                        </Box>
                                                    </form>
                                                    <Divider />
                                                    <InputField
                                                        name="email" label="Email" value={formData.email} type="text"
                                                        handleChange={handleChange} reference={emailField} disabled={true}
                                                        helperText="e-mail updation will be implmented in future versions"
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item md={0.25}></Grid>
                                            <RealTimeProfileViwer user={updatedUser} formData={formData} />
                                        </Grid>
                                        <Box sx={Object.assign({ display: "none" }, classes.postContainer)} />
                                    </>
                                    :
                                    <>
                                        <Grid container sx={classes.subContainer}>
                                            <Grid item xs={12} lg={8.75} sx={{ display: { xs: "none", lg: "block" } }}>
                                                {userPostsBlock()}
                                            </Grid>
                                            <Grid item md={0.25}></Grid>
                                            <ProfileBar updatedUser={updatedUser} setSnackbarState={setSnackbarState} setSnackbarValue={setSnackbarValue} />
                                        </Grid>
                                        <Box sx={{ display: { xs: "block", lg: "none" } }}>
                                            {userPostsBlock()}
                                        </Box>
                                    </>
                                }
                            </>
                        }
                    </>
                }
            </Box>
        </Grid>
    );
}

export default Profile;