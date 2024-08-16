import React, { useState, useEffect, useContext } from "react";
import { Avatar, Box, Button, Grid, IconButton, LinearProgress, ListItemIcon, Menu, MenuItem, Tab, Tabs, Typography } from "@mui/material";
import { DeleteTwoTone, EditNoteRounded, MoreVert } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { lineSpinner } from "ldrs";
// Importing my components
import SubspaceProfileBar from "./SubspaceProfileBar/SubspaceProfileBar";
import { formatMembersCount } from "../../utils/functions";
import NotFound from "../../Components/NotFound/NotFound";
import Posts from "../../Components/Posts/Posts";
// Importing contexts
import { ReRenderContext } from "../../contexts/ReRender.context";
import { SnackBarContext } from "../../contexts/SnackBar.context";
import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialog.context";
import { SubspaceDataContext } from "../../contexts/SubspaceData.context";
// Importing actions
import { joinSubspace } from "../../actions/subspace";
// Importing styling
import styles from "./styles";

function Subspace(props) {
    const { user } = props;
    const { subspaceName } = useParams();
    const { setReRender } = useContext(ReRenderContext);
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const { openDialog } = useContext(ConfirmationDialogContext);
    const { fetchAllSubspaceInfo, subspaceData, primaryLoading, secondaryLoading, noSubspaceFound, canModifySubspace, subspaceDeleted, subspacePostsCount, joined, setJoined } = useContext(SubspaceDataContext);

    const classes = styles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    lineSpinner.register("l-loader");

    useEffect(() => {
        document.title = "SyncSpace: ss/" + subspaceName;
        fetchAllSubspaceInfo(subspaceName);
    }, [subspaceName]);

    // JS for Menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    function handleMenuOpen(event) {
        setAnchorEl(event.currentTarget);
    };
    function handleMenuClose() {
        setAnchorEl(null);
    };
    // Tab Change
    if (!localStorage.getItem("subspacePageTabIndex")) {
        localStorage.setItem("subspacePageTabIndex", 0);
    }
    const [tabIndex, setTabIndex] = useState(Number(localStorage.getItem("subspacePageTabIndex")));
    function handleTabChange(event, newTabIndex) {
        setTabIndex(newTabIndex);
    };
    function subspacePostsContainer() {
        return (
            <>
                {secondaryLoading ?
                    <Box sx={classes.secondaryLoadingScreenStyling}>
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
                                    key={subspaceData._id}
                                    searchQuery={{ subspaceId: subspaceData._id }}
                                />
                            </Box>
                        }
                    </>
                }
            </>
        )
    }
    function handleCreate() {
        if (!user) {
            navigate("/authentication");
        } else if (joined) {
            navigate("/create-post", { state: { subspaceName, subspaceId: subspaceData?._id } });
        } else {
            openDialog({
                title: "Join Subspace", message: `Join ss/${subspaceName} to create posts.`,
                cancelBtnText: "Cancel", submitBtnText: "Join", dialogId: 4,
                rest: { navigate, subspaceData, subspaceName, handleJoin }
            });
        }
    }
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
            cancelBtnText: "Cancel", submitBtnText: "Delete", type: "error", dialogId: 5,
            rest: { navigate, subspaceData }
        });
    }

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                {noSubspaceFound ?
                    <NotFound
                        img={true} mainText="No such subspace found"
                        link={{ linkText: "Go home", to: "/", state: {} }}
                    />
                    :
                    <>
                        {subspaceDeleted ?
                            <Box>
                                <Box sx={classes.subspaceDeletedContainer}>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/drxwpfop.json" trigger="loop" delay="1000"
                                        colors="primary:#0090c1,secondary:#0090c1" style={{ width: "250px", height: "250px" }}
                                    />
                                </Box>
                                <NotFound
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
                                                    <Avatar sx={classes.subspaceAvatar} src={subspaceData.avatarURL} alt="Subspace avatar">{subspaceName.charAt(0)}</Avatar>
                                                </Box>
                                                <Box>
                                                    <Typography sx={classes.subspaceTitle}>{subspaceData.name}</Typography>
                                                    <Typography sx={classes.subspaceName}><span style={classes.subspaceString}>ss/</span>{subspaceData.name.replace(/ /g, "-")}</Typography>
                                                </Box>
                                            </Box>
                                            {canModifySubspace &&
                                                <>
                                                    <Box>
                                                        <IconButton sx={{ padding: "0" }} onClick={handleMenuOpen}><MoreVert /></IconButton>
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
                                        <Box sx={{ marginLeft: "16px" }}>
                                            <Tabs value={tabIndex} onChange={handleTabChange}>
                                                <Tab label="About" />
                                                <Tab label="Posts" />
                                            </Tabs>
                                        </Box>
                                        {tabIndex === 0 ?
                                            <>
                                                <SubspaceProfileBar user={user} classes={classes} subspaceData={subspaceData} />
                                                <Box hidden>
                                                    {subspacePostsContainer()}
                                                </Box>
                                            </>
                                            :
                                            <>
                                                {subspacePostsContainer()}
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

export default Subspace;