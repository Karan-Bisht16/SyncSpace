import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Grid, LinearProgress, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { lineSpinner } from "ldrs";
// Importing my components
import ConfirmationDialog from "../../Components/ConfirmationDialog/ConfirmationDialog";
import NotFound from "../../Components/NotFound/NotFound";
import { formatMembersCount } from "../../utils/functions";
import Posts from "../../Components/Posts/Posts";
// Importing actions
import { fetchAllSubspaceInfo, joinSubspace } from "../../actions/subspace";
// Importing styling
import styles from "./styles";

function Subspace(props) {
    const { user, setSnackbarValue, setSnackbarState } = props;
    const { subspaceName } = useParams();
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace: ss/" + subspaceName;
    });

    const [rerender, setRerender] = useState(false);
    const [primaryLoading, setPrimaryLoading] = useState(true);
    const [secondaryLoading, setSecondaryLoading] = useState(true);
    const [noSubspaceFound, setNoSubspaceFound] = useState(false);
    useEffect(() => {
        setPrimaryLoading(true);
        setSecondaryLoading(true);
        setNoSubspaceFound(false);
        setRerender(subspaceName);
        setSubspacePostsCount(0);
    }, [subspaceName]);
    // JS for Dialog
    const [dialog, setDialog] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        title: "",
        message: "",
        cancelBtnText: "",
        submitBtnText: "",
    });
    async function openDialog(values) {
        await setDialogValue(values);
        await setDialog(true);
        document.querySelector("#focusPostBtn").focus();
    };
    function closeDialog() {
        setDialog(false);
    };
    const [subspaceData, setSubspaceData] = useState({
        name: "Loading...",
        subspaceName: "Loading...",
        description: "Loading...",
        avatar: "",
    });
    const [subspacePostsCount, setSubspacePostsCount] = useState(0);
    useEffect(() => {
        async function fetchSubspaceInfo() {
            const { status, result } = await dispatch(fetchAllSubspaceInfo({ subspaceName: subspaceName }));
            if (status === 200) {
                setSubspaceData(result.subspaceData);
                setPrimaryLoading(false);
                setSubspacePostsCount(result.subspaceData.postsCount);
                setSecondaryLoading(false);
            } else if (status === 404) {
                setPrimaryLoading(false);
                setSecondaryLoading(false);
                setNoSubspaceFound(true);
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        }
        async function getSubspaceInfo() {
            if (user) {
                const desiredSubspace = user.subspacesJoined.filter(subspace => subspace.name.replace(/ /g, "-") === subspaceName)[0];
                if (desiredSubspace) {
                    setJoined(true);
                    setSubspaceData(desiredSubspace);
                    setPrimaryLoading(false);
                    fetchSubspaceInfo();
                } else {
                    fetchSubspaceInfo();
                }
            } else {
                fetchSubspaceInfo();
            }
        }
        getSubspaceInfo();
    }, [subspaceName, user, dispatch, setSnackbarValue, setSnackbarState]);

    function handleCreate() {
        if (!user) {
            navigate("/authentication");
        } else if (joined) {
            navigate("/create-post", { state: { subspaceName, subspaceId: subspaceData?._id } });
        } else {
            openDialog({ title: "Join Subspace", message: `Join ss/${subspaceName} to create posts.`, cancelBtnText: "Cancel", submitBtnText: "Join" });
        }
    }
    const [linearProgressBar, setLinearProgressBar] = useState(false);
    async function handleDialog() {
        setLinearProgressBar(true);
        await handleJoin();
        setLinearProgressBar(false);
        closeDialog();
        navigate("/create-post", { state: { subspaceName, subspaceId: subspaceData?._id } });
    }
    const [joined, setJoined] = useState(false);
    async function handleJoin() {
        if (user) {
            const { status, result } = await dispatch(joinSubspace({ action: !joined, subspaceName: subspaceName }));
            if (status === 200) {
                setJoined(!joined);
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        } else {
            navigate("/authentication");
        }
    }
    lineSpinner.register("l-loader");

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                {noSubspaceFound ?
                    <NotFound
                        img={true}
                        mainText="No such subspace found"
                        link={{ linkText: "Go home", to: "/", state: {} }}
                    />
                    :
                    <>
                        {primaryLoading ?
                            <Box sx={classes.primaryLoadingScreenStyling}>
                                <Typography sx={classes.titleFont}>Fetching subspace information</Typography>
                                <LinearProgress sx={classes.primaryProgressBar} />
                            </Box>
                            :
                            <>
                                <Box sx={classes.mainDialog}>
                                    <Box sx={classes.avatarContainer}>
                                        <Avatar sx={classes.subspaceAvatar} src={subspaceData.avatar} alt="Subspace avatar">{subspaceName.charAt(0)}</Avatar>
                                    </Box>
                                    <Box>
                                        <Typography sx={classes.subspaceTitle}>{subspaceData.name}</Typography>
                                        <Typography sx={classes.subspaceName}><span style={classes.subspaceString}>ss/</span>{subspaceData.name.replace(/ /g, "-")}</Typography>
                                        <Typography sx={classes.subspaceDescription}>{subspaceData.description}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={classes.subspaceOperation}>
                                    <Typography sx={{ fontSize: { xs: "10px", sm: "12px" } }}>
                                        {subspaceData?.membersCount ?
                                            formatMembersCount(subspaceData.membersCount)
                                            : "Loading..."
                                        }
                                    </Typography>
                                    <Box sx={classes.subspaceBtn}>
                                        {joined ?
                                            <Button sx={Object.assign({}, classes.btn, classes.joinedBtn)} onClick={handleJoin}>Joined</Button>
                                            :
                                            <Button sx={Object.assign({}, classes.btn, classes.notJoinedBtn)} onClick={handleJoin}>Join</Button>
                                        }
                                        <Button
                                            variant="contained" onClick={handleCreate}
                                            sx={Object.assign({ display: { xs: "none", sm: "block" } }, classes.btn, classes.notJoinedBtn)}
                                        >+ Create</Button>
                                        <Button
                                            variant="contained" onClick={handleCreate}
                                            sx={Object.assign({ display: { xs: "block", sm: "none" }, borderRadius: "100px", fontSize: "12px" }, classes.notJoinedBtn)}
                                        >+</Button>
                                    </Box>
                                </Box>
                                {secondaryLoading ?
                                    <Box sx={classes.postContainer}>
                                        <l-loader size="75" speed="1.75" color="#0090c1" />
                                    </Box>
                                    :
                                    <>
                                        {subspacePostsCount === 0 ?
                                            <Box sx={classes.postContainer}>
                                                <>
                                                    {joined ?
                                                        <NotFound
                                                            mainText="No post in this subspace"
                                                            link={{ linkText: "Create one", to: "/create-post", state: { subspaceName, subspaceId: subspaceData?._id } }}
                                                        />
                                                        :
                                                        <Box sx={{ textAlign: "center" }}>
                                                            <NotFound
                                                                mainText="No post in this subspace"
                                                                link={false}
                                                            />
                                                            <Typography sx={classes.link} onClick={handleCreate}>Create One</Typography>
                                                        </Box>
                                                    }
                                                </>
                                            </Box>
                                            :
                                            <Box sx={classes.subspacePostContainer}>
                                                <Posts
                                                    key={rerender} searchQuery={{ subspaceName: rerender }}
                                                    setSnackbarValue={setSnackbarValue} setSnackbarState={setSnackbarState}
                                                />
                                            </Box>
                                        }
                                    </>
                                }
                            </>
                        }
                    </>
                }
            </Box>
            <ConfirmationDialog dialog={dialog} closeDialog={closeDialog} handleDialog={handleDialog} linearProgressBar={linearProgressBar} dialogValue={dialogValue} />
        </Grid>
    );
}

export default Subspace;