import React, { useState, useEffect, useRef } from "react";
import { Avatar, Box, Button, Divider, Grid, LinearProgress, Typography } from "@mui/material";
import { CloseRounded, ModeEdit } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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

function Account(props) {
    const { user, setSnackbarValue, setSnackbarState } = props;
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace";
    });

    const token = localStorage.getItem("token");
    if (!token) { navigate("/authentication"); }

    const nameField = useRef(null);
    const emailField = useRef(null);
    const bioField = useRef(null);
    // Fetching user info
    const [updatedUser, setUpdatedUser] = useState(user);
    const [userPostsCount, setUserPostsCount] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function getUserInfo() {
            try {
                const { status, result } = await dispatch(fetchUserInfo({ userName: user.name.replace(/ /g, "-") }));
                if (status === 200) {
                    setUpdatedUser(result);
                    document.title = "SyncSpace: e/" + result.userName;
                    setFormData({
                        name: result.name,
                        email: result.email,
                        bio: result.bio,
                    });
                    setUserPostsCount(result.postsCount);
                } else {
                    setUpdatedUser(false);
                    setSnackbarValue({ message: result.message, status: "error" });
                    setSnackbarState(true);
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        getUserInfo();
    }, [user, dispatch, setSnackbarValue, setSnackbarState]);
    function userPostsBlock() {
        if (userPostsCount === 0) {
            return (
                <Box sx={classes.noContentContainer}>
                    <NotFound mainText="You haven't posted anything" />
                </Box>
            );
        }
        return (
            <Posts searchQuery={{ authorId: updatedUser._id }} setSnackbarValue={setSnackbarValue} setSnackbarState={setSnackbarState} />
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
                navigate("/account", { state: { message: "Account updated successfully!", status: "success" } });
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
                {loading ?
                    <Box sx={classes.loadingScreenStyling}>
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
                            <>
                                <Grid container sx={classes.subContainer}>
                                    <Grid item xs={12} lg={8.75} sx={{ display: { xs: "none", lg: "block" } }}>
                                        {userPostsBlock()}
                                    </Grid>
                                    <Grid item md={0.25}></Grid>
                                    <ProfileBar user={updatedUser} setSnackbarState={setSnackbarState} setSnackbarValue={setSnackbarValue} />
                                </Grid>
                                <Box sx={{ display: { xs: "block", lg: "none" } }}>
                                    {userPostsBlock()}
                                </Box>
                            </>
                            :
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
                        }
                    </>
                }
            </Box>
        </Grid>
    );
}

export default Account;