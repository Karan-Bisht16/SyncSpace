import React, { useState, useEffect } from "react";
import { Avatar, Box, Checkbox, Grid, IconButton, ListItemIcon, Menu, MenuItem, Paper, Tooltip, Typography } from "@mui/material";
import { FiberManualRecordTwoTone, CloseRounded, CommentOutlined, DeleteTwoTone, DoneAll, EditNoteRounded, Favorite, FavoriteBorderOutlined, Link, MoreHoriz } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Carousel from "react-bootstrap/Carousel";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import parse from "html-react-parser";
// Importing my components
import ConfirmationDialog from "../../ConfirmationDialog/ConfirmationDialog";
import { formatDate, formatTime } from "../../../utils/functions";
// Importing actions
import { deletePost, isPostLiked, likePost } from "../../../actions/post";
// Importing styling
import styles from "./styles";

function Post(props) {
    const { post, individual, redirect, snackbar, confirmationDialog } = props;
    const { _id, authorId, authorDetails, subspaceDetails, dateCreated, title, body, selectedFile, likesCount, commentsCount, edited } = post;
    const [setSnackbarValue, setSnackbarState] = snackbar;
    const [dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar] = confirmationDialog;
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.user);
    const [postLiked, setPostLiked] = useState(false);

    useEffect(() => {
        async function checkIfPostIsLiked() {
            const { status, result } = await dispatch(isPostLiked({ postId: _id, userId: user._id }));
            if (status === 200) { setPostLiked(result) }
        }
        if (user) { checkIfPostIsLiked() }
    }, [_id, user, dispatch]);
    function handleSubspaceClick(subspaceName) {
        navigate("/ss/" + subspaceName);
    }
    function handleUserProfileClick(userName) {
        navigate("/e/" + userName);
    }
    function handlePostClick() {
        navigate("/post/" + _id, { state: { postData: { post } } });
    }
    function handlePostClose() {
        if (redirect) { navigate("/") }
        else { navigate(-1) }
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
    function handleEdit() {
        handleCloseMenu();
        navigate("/edit-post/" + _id, { state: { post } });
    }
    const [postLikesCount, setPostLikesCount] = useState(likesCount);
    async function handleLike() {
        if (user) {
            const tempPostLiked = postLiked;
            setPostLiked(!postLiked);
            if (tempPostLiked) {
                setPostLikesCount(postLikesCount - 1);
            } else {
                setPostLikesCount(postLikesCount + 1);
            }
            const { status, result } = await dispatch(likePost({ postId: post._id, userId: user._id, action: !tempPostLiked }));
            if (status !== 200) {
                setPostLiked(tempPostLiked);
                if (tempPostLiked) {
                    setPostLikesCount(postLikesCount + 1);
                } else {
                    setPostLikesCount(postLikesCount - 1);
                }
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
        <Grid item sx={classes.mainContainer}>
            <Box>
                <Box sx={classes.subContainer}>
                    <Box sx={classes.postHeader}>
                        <Box sx={classes.avatarContainer}>
                            <Avatar sx={classes.avatar} alt="Subspace avatar" src={subspaceDetails.avatar}>
                                {subspaceDetails.subspaceName.charAt(0)}
                            </Avatar>
                        </Box>
                        <Box sx={classes.postHeaderDetails}>
                            {subspaceDetails.isDeleted ?
                                <Typography sx={classes.postSubspace}><span style={classes.headerText}>ss/</span>[Deleted]</Typography>
                                :
                                <Typography sx={classes.postSubspace} onClick={() => handleSubspaceClick(subspaceDetails.subspaceName)}>
                                    <span style={classes.headerText}>ss/</span>{subspaceDetails.subspaceName}
                                </Typography>
                            }
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
                <>
                    <Paper sx={classes.bodyContainer}>
                        <Typography sx={classes.bodyText} component={"div"}>{bodyText()}</Typography>
                    </Paper>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 8px 16px" }}>
                        <Box>
                            {edited ?
                                <span style={{ fontSize: "10px" }}>[Edited]</span>
                                :
                                <span></span>
                            }
                        </Box>
                        <Box>
                            {authorDetails.isDeleted ?
                                <span style={classes.author}><span style={{ fontSize: "13px" }}>e/</span>[Deleted]</span>
                                :
                                <span style={classes.author} onClick={() => handleUserProfileClick(authorDetails.userName)}>
                                    <span style={{ fontSize: "13px" }}>e/</span>{authorDetails.userName}
                                </span>
                            }
                        </Box>
                    </Box>
                </>
                :
                <>
                    {selectedFile.length > 1 ?
                        <Box sx={classes.fileContainer}>
                            <Carousel slide={false} interval={null} activeIndex={index} onSelect={handleSelect} style={classes.imageContainer}>
                                {selectedFile.map((file, index) =>
                                    file.type.includes("image") ?
                                        <Carousel.Item key={index} style={{ objectFit: "scale-down", height: "100%", textAlign: "center" }}>
                                            <img src={file.file} alt={title} style={classes.multipleImageBox} />
                                        </Carousel.Item>
                                        :
                                        <Carousel.Item key={index} style={{ objectFit: "scale-down", width: "100%", lineHeight: "75px", height: "50px" }}>
                                            <Box sx={{ textAlign: "center" }}>Multiple files of {file.type} are not implemented.</Box>
                                        </Carousel.Item>
                                )}
                            </Carousel>
                        </Box>
                        :
                        <Box sx={classes.singleFileContainer}>
                            {selectedFile[0].type.includes("image") &&
                                <Box sx={classes.imageContainer}>
                                    <img style={classes.imageBox} src={selectedFile[0].file} alt="post related" />
                                </Box>
                            } {selectedFile[0].type.includes("video") &&
                                <Box sx={classes.imageContainer}>
                                    <video controls style={{ borderRadius: "16px" }}>
                                        <source type={selectedFile[0].type} src={selectedFile[0].file} />
                                    </video>
                                </Box>
                            }{selectedFile[0].type.includes("audio") &&
                                <Box sx={{ bgcolor: "background.default", borderRadius: "16px", margin: "8px 0" }}>
                                    <AudioPlayer
                                        autoPlay={false}
                                        src={selectedFile[0].file}
                                        onPlay={e => console.log("")}
                                        style={{ borderRadius: "16px", background: "inherit" }}
                                    />
                                </Box>
                            }
                        </Box>
                    }
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0 16px 8px 16px" }}>
                        <Box>
                            {edited ?
                                <span style={{ fontSize: "10px" }}>[Edited]</span>
                                :
                                <span></span>
                            }
                        </Box>
                        <Box>
                            {authorDetails.isDeleted ?
                                <span style={classes.author}><span style={{ fontSize: "13px" }}>e/</span>[Deleted]</span>
                                :
                                <span style={classes.author} onClick={() => handleUserProfileClick(authorDetails.userName)}>
                                    <span style={{ fontSize: "13px" }}>e/</span>{authorDetails.userName}
                                </span>
                            }
                        </Box>
                    </Box>
                </>
            }
            <Box sx={classes.allPostActionsContainer}>
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
                {individual && user && (user._id === authorId) &&
                    <Box>
                        <IconButton onClick={handleClickMenu}>
                            <MoreHoriz />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseMenu}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            sx={{ marginTop: "8px" }}
                        >
                            <MenuItem onClick={handleDelete}>
                                <ListItemIcon>
                                    <DeleteTwoTone fontSize="small" />
                                </ListItemIcon>
                                Delete post
                            </MenuItem>
                            <MenuItem onClick={handleEdit}>
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