import React, { useState, useEffect } from "react";
import { Avatar, Box, Checkbox, Grid, IconButton, ListItemIcon, Menu, MenuItem, Paper, Tooltip, Typography } from "@mui/material";
import { FiberManualRecordTwoTone, CloseRounded, CommentOutlined, DeleteTwoTone, DoneAll, EditNoteRounded, Favorite, FavoriteBorderOutlined, Link, MoreHoriz } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Carousel from "react-bootstrap/Carousel";
import parse from "html-react-parser";
// Importing my components
import ConfirmationDialog from "../../ConfirmationDialog/ConfirmationDialog";
import { formatDate, formatTime } from "../../../utils/functions";
// Importing actions
import { fetchSubspaceAvatar } from "../../../actions/subspace";
import { deletePost, isPostLiked, likePost } from "../../../actions/post";
// Importing styling
import styles from "./styles";

function Post(props) {
    const { post, individual, redirect, snackbar, confirmationDialog } = props;
    const { subspaceName, authorName, dateCreated, title, body, selectedFile, likesCount, commentsCount } = post;
    const [setSnackbarValue, setSnackbarState] = snackbar;
    const [dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar] = confirmationDialog;
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.user);
    const [postLiked, setPostLiked] = useState(false);
    const [subspaceAvatar, setSubspaceAvatar] = useState(null);
    useEffect(() => {
        async function getSubspaceAvatar() {
            const { status, result } = await dispatch(fetchSubspaceAvatar({ subspaceName }));
            if (status === 200) {
                setSubspaceAvatar(result.subspaceAvatar);
            }
        }
        async function checkIfPostIsLiked() {
            const { status, result } = await dispatch(isPostLiked({ postId: post._id, userId: user._id }));
            if (status === 200) {
                setPostLiked(result);
            }
        }
        if (user) {
            checkIfPostIsLiked();
            const desiredSubspace = user.subspacesJoined.filter(subspace => subspace.name.replace(/ /g, "-") === subspaceName)[0];
            if (desiredSubspace) {
                setSubspaceAvatar(desiredSubspace.avatar);
            } else {
                getSubspaceAvatar();
            }
        } else {
            getSubspaceAvatar();
        }
        // check if post is liked: in 'like' collection check for a recod where you have both postId and userId
        // change styling spread out post actions on mobile
    }, [post._id, user, subspaceName, dispatch]);
    function handleSubspaceClick() {
        navigate("/ss/" + subspaceName);
    }
    function handleUserProfileClick() {
        navigate("/e/" + authorName);
    }
    function handlePostClick() {
        navigate("/post/" + post._id, { state: { post } });
    }
    function handlePostClose() {
        if (redirect) {
            navigate("/");
        } else {
            navigate(-1);
        }
    }
    const [index, setIndex] = useState(0);
    function handleSelect(selectedIndex) {
        setIndex(selectedIndex);
    };
    const [linkCopied, setLinkCopied] = useState(false);
    function handleLinkCopied() {
        navigator.clipboard.writeText(process.env.REACT_APP_DOMAIN + "/post/" + post._id)
        setLinkCopied(true);
        setSnackbarValue({ message: "Link copied to clipboard", status: "info" });
        setSnackbarState(true);
    }
    function bodyText() {
        const options = {
            replace(domNode) {
                if (domNode.name === "img") {
                    return <img
                        src={domNode.attribs.src} alt="post related img init"
                        style={{ height: "100%", width: "100%", verticalAlign: "middle" }}
                    />;
                }
            }
        };
        return (
            parse(body, options)
        );
    }
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    function handleClickMenu(event) {
        setAnchorEl(event.currentTarget);
    };
    function handleCloseMenu() {
        setAnchorEl(null);
    };
    const [postLikesCount, setPostLikesCount] = useState(likesCount);
    async function handleLike() {
        if (user) {
            const { status, result } = await dispatch(likePost({ postId: post._id, userId: user._id, action: !postLiked }));
            if (status === 200) {
                if (postLiked) {
                    setPostLikesCount(postLikesCount - 1);
                } else {
                    setPostLikesCount(postLikesCount + 1);
                }
                setPostLiked(!postLiked);
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        } else {
            navigate("/authentication");
        }
    }
    async function handleDelete() {
        handleCloseMenu();
        openDialog({ title: "Delete post", message: "This action is irreversible", cancelBtnText: "Cancel", submitBtnText: "Delete", type: "error" });
    }
    async function handleDialog() {
        setLinearProgressBar(true);
        try {
            const { status, result } = await dispatch(deletePost({ postId: post._id }));
            closeDialog();
            if (status === 200) {
                navigate("/", { state: { message: "Post deleted.", status: "success" } });
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        } catch (error) {
            closeDialog();
            setSnackbarValue({ message: error.message, status: "error" });
            setSnackbarState(true);
        }
    }

    return (
        <Grid item sx={Object.assign({ bgcolor: !individual && "background.backdrop" }, classes.mainContainer)}>
            <Box>
                <Box sx={classes.subContainer}>
                    <Box sx={classes.postHeader}>
                        <Box sx={classes.avatarContainer}>
                            <Avatar sx={classes.avatar} src={subspaceAvatar} alt="Subspace avatar">
                                {subspaceName.charAt(0)}
                            </Avatar>
                        </Box>
                        <Box sx={classes.postHeaderDetails}>
                            <Typography sx={classes.postSubspace} onClick={handleSubspaceClick}>
                                <span style={classes.headerText}>ss/</span>{subspaceName}
                            </Typography>
                            <FiberManualRecordTwoTone sx={{ fontSize: "8px" }} />
                            <Tooltip title={formatDate(dateCreated)}>
                                <Typography sx={classes.headerText}>{formatTime(dateCreated)} ago</Typography>
                            </Tooltip>
                        </Box>
                    </Box>
                    {individual &&
                        <IconButton sx={classes.closeBtn} onClick={handlePostClose}><CloseRounded /></IconButton>
                    }
                </Box>
                <Typography sx={classes.link} onClick={handlePostClick} variant="h6">{title}</Typography>
            </Box>
            {body ?
                <Box sx={classes.bodyContainer}>
                    <Typography sx={classes.bodyText} component={"div"}>{bodyText()}</Typography>
                    <Typography sx={classes.author} onClick={handleUserProfileClick}>e/{authorName}</Typography>
                </Box>
                :
                <>
                    <Box sx={classes.fileContainer} >
                        {selectedFile.length > 1 ?
                            <Carousel slide={false} activeIndex={index} onSelect={handleSelect} style={classes.imageContainer}>
                                {selectedFile.map((file, index) =>
                                    file.type.includes("image") &&
                                    <Carousel.Item key={index} style={{ objectFit: "scale-down" }}>
                                        <img
                                            src={file.file} alt="post related img init"
                                            style={classes.imageBox}
                                        />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                            :
                            <Box sx={classes.imageContainer}>
                                <img style={classes.imageBox} src={selectedFile[0].file} alt="post related" />
                            </Box>
                        }
                    </Box>
                    <Typography sx={classes.author} onClick={handleUserProfileClick}>e/{authorName}</Typography>
                </>
            }
            <Box elevation={2} sx={classes.allPostActionsContainer}>
                <Paper sx={classes.majorPostActionsContainer}>
                    <Box>
                        <Checkbox onClick={handleLike} checked={postLiked} icon={<FavoriteBorderOutlined sx={classes.iconColor} />} checkedIcon={<Favorite sx={{ color: "#0090c1" }} />} />
                        <span style={classes.iconText}>{postLikesCount}</span>
                    </Box>
                    {individual ?
                        <Box>
                            <IconButton>
                                <CommentOutlined sx={classes.iconColor} />
                            </IconButton>
                            <span style={classes.iconText}>{commentsCount}</span>
                        </Box>
                        :
                        <Box sx={classes.link} onClick={handlePostClick} >
                            <IconButton>
                                <CommentOutlined sx={classes.iconColor} />
                            </IconButton>
                            <span style={classes.iconText}>{commentsCount}</span>
                        </Box>
                    }
                    <Tooltip title={linkCopied ? "Post link copied" : "Copy post link"}>
                        {linkCopied ?
                            <IconButton onClick={handleLinkCopied}>
                                <DoneAll sx={classes.iconColor} />
                            </IconButton>
                            :
                            <IconButton onClick={handleLinkCopied}>
                                <Link sx={classes.iconColor} />
                            </IconButton>
                        }
                    </Tooltip>
                </Paper>
                {individual && user && (user.userName === authorName) &&
                    <Box>
                        <IconButton onClick={handleClickMenu}>
                            <MoreHoriz />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            onClose={handleCloseMenu}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                            sx={{ marginTop: "8px" }}
                        >
                            <MenuItem variant="error" onClick={handleDelete}>
                                <ListItemIcon>
                                    <DeleteTwoTone fontSize="small" />
                                </ListItemIcon>
                                Delete post
                            </MenuItem>
                            <MenuItem disabled>
                                <ListItemIcon>
                                    <EditNoteRounded fontSize="small" />
                                </ListItemIcon>
                                Edit post
                            </MenuItem>
                        </Menu>
                    </Box>
                }
            </Box>
            <ConfirmationDialog dialog={dialog} closeDialog={closeDialog} handleDialog={handleDialog} linearProgressBar={linearProgressBar} dialogValue={dialogValue} />
        </Grid >
    );
}

export default Post;