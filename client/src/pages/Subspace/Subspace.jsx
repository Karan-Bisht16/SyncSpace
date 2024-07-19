import React, { useState, useEffect, useContext, useRef } from "react";
import { Avatar, Box, Button, Grid, IconButton, LinearProgress, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { DeleteTwoTone, EditNoteRounded, MoreVert } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Player } from "@lordicon/react";
import { lineSpinner } from "ldrs";
import ConfirmationDialog from "../../Components/ConfirmationDialog/ConfirmationDialog";
import NotFound from "../../Components/NotFound/NotFound";
import { formatMembersCount } from "../../utils/functions";
import Posts from "../../Components/Posts/Posts";
import { ReRenderContext } from "../../store";
import { fetchSubspaceInfo, joinSubspace, deleteSubspace, isSubspaceJoined } from "../../actions/subspace";
import styles from "./styles";

function Subspace(props) {
    const { user, snackbar, confirmationDialog } = props;
    const [setSnackbarValue, setSnackbarState] = snackbar;
    const [dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar] = confirmationDialog;
    const { subspaceName } = useParams();
    const classes = styles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setReRender } = useContext(ReRenderContext);

    useEffect(() => {
        document.title = "SyncSpace: ss/" + subspaceName;
    });

    const [primaryLoading, setPrimaryLoading] = useState(true);
    const [secondaryLoading, setSecondaryLoading] = useState(true);
    const [noSubspaceFound, setNoSubspaceFound] = useState(false);
    const [canModifySubspace, setCanModifySubspace] = useState(false);
    const [subspaceDeleted, setSubspaceDeleted] = useState(false);
    const [subspacePostsCount, setSubspacePostsCount] = useState(0);
    const [reRenderSubspacePosts, setReRenderSubspacePosts] = useState({});
    useEffect(() => {
        setReRenderSubspacePosts({});
        setPrimaryLoading(true);
        setSecondaryLoading(true);
        setNoSubspaceFound(false);
        setCanModifySubspace(false);
        setSubspaceDeleted(false);
        setSubspacePostsCount(0);
    }, [subspaceName]);
    const [subspaceData, setSubspaceData] = useState(null);
    useEffect(() => {
        async function fetchAllSubspaceInfo() {
            const { status, result } = await dispatch(fetchSubspaceInfo({ subspaceName }));
            if (status === 200) {
                const subspace = result;
                if (subspace.isDeleted) { setSubspaceDeleted(true) }
                else {
                    setSubspaceData(subspace);
                    setReRenderSubspacePosts(subspace._id);
                    if (user) {
                        if (user._id === subspace.creator) {
                            setCanModifySubspace(true);
                        }
                        const { status, result } = await dispatch(isSubspaceJoined({ userId: user._id, subspaceId: subspace._id }));
                        if (status === 200) { setJoined(result) }
                    }
                    setSubspacePostsCount(subspace.postsCount);
                }
                setPrimaryLoading(false);
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
        fetchAllSubspaceInfo();
    }, [subspaceName, user, dispatch, setSnackbarValue, setSnackbarState]);
    // JS for Menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    function handleMenuOpen(event) {
        setAnchorEl(event.currentTarget);
    };
    function handleMenuClose() {
        setAnchorEl(null);
    };
    function handleCreate() {
        if (!user) {
            navigate("/authentication");
        } else if (joined) {
            navigate("/create-post", { state: { subspaceName, subspaceId: subspaceData?._id } });
        } else {
            openDialog({ title: "Join Subspace", message: `Join ss/${subspaceName} to create posts.`, cancelBtnText: "Cancel", submitBtnText: "Join" });
        }
    }
    const [joined, setJoined] = useState(false);
    async function handleJoin() {
        if (user) {
            const tempJoined = joined;
            setJoined(!joined);
            const { status, result } = await dispatch(joinSubspace({ subspaceId: subspaceData._id, userId: user._id, action: !tempJoined, }));
            setReRender(prevReRender => !prevReRender);
            if (status !== 200) {
                setJoined(tempJoined);
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        } else {
            navigate("/authentication");
        }
    }
    function handleSubspaceUpdate() {
        navigate(`/ss/update/${subspaceName}`, { state: { subspaceData } });
    }
    function handleSubspaceDelete() {
        handleMenuClose();
        openDialog({
            title: "Delete Subspace",
            message:
                <span>
                    This action is irreversible. Once deleted, you will not be able to create a new subspace with the same name (i.e., ss/<b>{subspaceName}</b>).
                    If you intend to delete this subspace only to recreate it, please consider using the 'Update Subspace' option instead.
                    <br /><br />
                    Are you sure you want to proceed?
                </span>,
            cancelBtnText: "Cancel", submitBtnText: "Delete", type: "error"
        });
    }
    async function handleDialog() {
        setLinearProgressBar(true);
        if (dialogValue.submitBtnText.toUpperCase() === "JOIN") {
            await handleJoin();
            closeDialog();
            navigate("/create-post", { state: { subspaceName, subspaceId: subspaceData?._id } });
        } else if (dialogValue.submitBtnText.toUpperCase() === "DELETE") {
            const { status, result } = await dispatch(deleteSubspace({ subspaceId: subspaceData?._id }));
            closeDialog();
            if (status === 200) {
                setReRender(prevReRender => !prevReRender);
                navigate("/", { state: { message: "Subspace deleted successfully", status: "success", time: new Date().getTime() } });
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarValue(true);
            }
        }
    }
    const ICON = require("../../assets/animation-deleted.json");
    const playerRef = useRef(null);
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
                        {subspaceDeleted ?
                            <Box>
                                <Box sx={classes.subspaceDeletedContainer}>
                                    <Player ref={playerRef} icon={ICON} size={250} />
                                    {playerRef.current?.playFromBeginning()}
                                </Box>
                                <NotFound
                                    img={false}
                                    mainText={`s/${subspaceName} was deleted`}
                                    link={{ linkText: "Go home", to: "/", state: {} }}
                                />
                            </Box>
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
                                            <Box sx={classes.mainText}>
                                                <Box sx={classes.avatarContainer}>
                                                    <Avatar sx={classes.subspaceAvatar} src={subspaceData.avatar} alt="Subspace avatar">{subspaceName.charAt(0)}</Avatar>
                                                </Box>
                                                <Box>
                                                    <Typography sx={classes.subspaceTitle}>{subspaceData.name}</Typography>
                                                    <Typography sx={classes.subspaceName}><span style={classes.subspaceString}>ss/</span>{subspaceData.name.replace(/ /g, "-")}</Typography>
                                                    <Typography sx={classes.subspaceDescription}>{subspaceData.description}</Typography>
                                                </Box>
                                            </Box>
                                            {canModifySubspace &&
                                                <>
                                                    <Box>
                                                        <IconButton onClick={handleMenuOpen}><MoreVert /></IconButton>
                                                        <Menu
                                                            id="basic-menu"
                                                            anchorEl={anchorEl}
                                                            open={open}
                                                            onClose={handleMenuClose}
                                                            anchorOrigin={{
                                                                vertical: "bottom",
                                                                horizontal: "right",
                                                            }}
                                                            transformOrigin={{
                                                                vertical: "top",
                                                                horizontal: "right",
                                                            }}
                                                        >
                                                            <MenuItem onClick={handleSubspaceUpdate}>
                                                                <ListItemIcon>
                                                                    <EditNoteRounded fontSize="small" />
                                                                </ListItemIcon>
                                                                Update
                                                            </MenuItem>
                                                            <MenuItem onClick={handleSubspaceDelete}>
                                                                <ListItemIcon>
                                                                    <DeleteTwoTone fontSize="small" />
                                                                </ListItemIcon>
                                                                Delete
                                                            </MenuItem>
                                                        </Menu>
                                                    </Box>
                                                </>
                                            }
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
                                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
                                                <l-loader size="75" speed="1.75" color="#0090c1" />
                                            </Box>
                                            :
                                            <>
                                                {subspacePostsCount === 0 ?
                                                    <Box sx={classes.noContentContainer}>
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
                                                                    <Typography sx={classes.link} onClick={handleCreate}>Create one</Typography>
                                                                </Box>
                                                            }
                                                        </>
                                                    </Box>
                                                    :
                                                    <Box sx={classes.subspacePostContainer}>
                                                        <Posts
                                                            key={reRenderSubspacePosts}
                                                            searchQuery={{ subspaceId: reRenderSubspacePosts }}
                                                            snackbar={snackbar} confirmationDialog={confirmationDialog}
                                                        />
                                                    </Box>
                                                }
                                            </>
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