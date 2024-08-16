import React, { useState, useEffect, useContext, useRef } from "react";
import { Avatar, Box, Button, Divider, Grid, LinearProgress, Tab, Tabs, Typography } from "@mui/material";
import { CloseRounded, ModeEdit } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing my components
import RealTimeProfileViwer from "./RealTimeProfileViewer/RealTimeProfileViewer";
import InputField from "../../Components/InputField/InputField";
import ProfileBar from "../../Components/ProfileBar/ProfileBar";
import UserPostsBlock from "./UserPostsBlock/UserPostsBlock";
import NotFound from "../../Components/NotFound/NotFound";
// Importing contexts
import { SnackBarContext } from "../../contexts/SnackBar.context";
import { UserDataContext } from "../../contexts/UserData.context";
// Importing actions
import { updateProfile } from "../../actions/user";
// Importing styling
import styles from "./styles";

function Profile(props) {
    const { user } = props;
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const { fetchAllUserInfo, updatedUser, setUpdatedUser, primaryLoading, secondaryLoading, noUserFound, userProfileDeleted, userPostsCount } = useContext(UserDataContext);
    const { userName } = useParams();
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "SyncSpace: e/" + userName;
        fetchAllUserInfo(userName, setFormData);
    }, [userName]);

    const nameField = useRef(null);
    const emailField = useRef(null);
    const bioField = useRef(null);

    // Tab Change
    const [tabIndex, setTabIndex] = useState(0);
    function handleTabChange(event, newTabIndex) {
        setTabIndex(newTabIndex);
    };
    const [editProfile, setEditProfile] = useState(false);
    function handleEditProfile() {
        setEditProfile(prevEditProfile => {
            return !prevEditProfile;
        })
    }
    const [formData, setFormData] = useState({
        name: user.name,
        bio: user.bio,
        email: user.email,
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
            setSnackbarValue({ message: "Invalid Username", status: "error" });
            setSnackbarState(true);
            return false;
        }
        try {
            const { status, result } = await dispatch(updateProfile(formData));
            if (status === 200) {
                setEditProfile(false);
                setUpdatedUser(prevUser => {
                    return { ...prevUser, name: formData.name, userName: formData.name.replace(/ /g, "-"), bio: formData.bio }
                });
                navigate(`/e/${formData.name.replace(/ /g, "-")}`, {
                    state: { message: "Account updated successfully!", status: "success", time: new Date().getTime() }
                });
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
                        img={true} mainText="No user found"
                        link={{ linkText: "Go home", to: "/", state: {} }}
                    />
                    :
                    <>
                        {userProfileDeleted ?
                            <Box>
                                <Box sx={classes.profileDeletedContainer}>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/drxwpfop.json" trigger="loop" delay="1000"
                                        colors="primary:#0090c1,secondary:#0090c1" style={{ width: "250px", height: "250px" }}
                                    />
                                </Box>
                                <NotFound
                                    mainText="This profile has been deleted"
                                    link={{ linkText: "Go home", to: "/", state: {} }}
                                />
                            </Box>
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
                                                <Box sx={classes.editProfileBtn} onClick={handleEditProfile}>
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
                                                <Box sx={{ marginLeft: "16px" }}>
                                                    <Tabs value={0}>
                                                        <Tab label="Edit Profile" />
                                                    </Tabs>
                                                </Box>
                                                <Grid container>
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
                                                    <RealTimeProfileViwer user={updatedUser} classes={classes} formData={formData} />
                                                </Grid>
                                                <Box sx={Object.assign({ display: "none" }, classes.postContainer)} />
                                            </>
                                            :
                                            <>
                                                <Grid container sx={classes.subContainer}>
                                                    <Grid item xs={12} lg={8.75} sx={{ display: { xs: "none", lg: "block" } }}>
                                                        <UserPostsBlock
                                                            user={updatedUser} classes={classes} userPostsCount={userPostsCount}
                                                            secondaryLoading={secondaryLoading} tabIndex={tabIndex} handleTabChange={handleTabChange}
                                                        />
                                                    </Grid>
                                                    <Grid item md={0.25}></Grid>
                                                    <ProfileBar user={updatedUser} />
                                                </Grid>
                                                <Box sx={{ display: { xs: "block", lg: "none" } }}>
                                                    <UserPostsBlock
                                                        user={updatedUser} classes={classes} userPostsCount={userPostsCount}
                                                        secondaryLoading={secondaryLoading} tabIndex={tabIndex} handleTabChange={handleTabChange}
                                                    />
                                                </Box>
                                            </>
                                        }
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