import React, { useState, useContext } from "react";
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Paper, Tooltip } from "@mui/material";
import { CommentOutlined, DeleteTwoTone, DoneAll, EditNoteRounded, Favorite, FavoriteBorderOutlined, Link, MoreHoriz } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// Importing contexts
import { ConfirmationDialogContext, SnackBarContext } from "../../../../store/index";

function PostOperations(props) {
    const { classes, user, post, individual, postLiked, postLikesCount, handleLike, handlePostClick } = props;
    const { _id, authorId, commentsCount } = post;
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const { openDialog } = useContext(ConfirmationDialogContext);
    const navigate = useNavigate();

    const [linkCopied, setLinkCopied] = useState(false);
    function handleLinkCopied() {
        navigator.clipboard.writeText(window.location.href)
        setLinkCopied(true);
        setSnackbarValue({ message: "Link copied to clipboard", status: "info" });
        setSnackbarState(true);
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
    function handleDelete() {
        handleCloseMenu();
        openDialog({
            title: "Delete post",
            message:
                <span>
                    This action is irreversible.
                    <br /><br />
                    Are you sure you want to proceed?
                </span>,
            cancelBtnText: "Cancel", submitBtnText: "Delete", type: "error"
        });
    }
    function otherOpertionsContainer() {
        return (
            <>
                {individual && user && (user._id === authorId) &&
                    <Box>
                        <IconButton sx={{ padding: "0" }} onClick={handleClickMenu}>
                            <MoreHoriz />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCloseMenu}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            sx={{ marginTop: "8px" }}
                        >
                            <MenuItem onClick={handleEdit}>
                                <ListItemIcon>
                                    <EditNoteRounded fontSize="small" />
                                </ListItemIcon>
                                Edit post
                            </MenuItem>
                            <MenuItem onClick={handleDelete}>
                                <ListItemIcon>
                                    <DeleteTwoTone fontSize="small" />
                                </ListItemIcon>
                                Delete post
                            </MenuItem>
                        </Menu>
                    </Box>
                }
            </>
        );
    }

    return (
        <>
            <Box sx={classes.allPostActionsContainer}>
                <Paper sx={classes.majorPostActionsContainer}>
                    <Box sx={classes.iconContainer} onClick={handleLike}>
                        {postLiked ?
                            <Favorite sx={{ color: "#0090c1" }} />
                            :
                            <FavoriteBorderOutlined />
                        }
                        <span style={classes.iconText}>{postLikesCount}</span>
                    </Box>
                    <Box sx={classes.iconContainer} onClick={handlePostClick}>
                        <CommentOutlined />
                        <span style={classes.iconText}>{commentsCount}</span>
                    </Box>
                    <Tooltip title={linkCopied ? "Post link copied" : "Copy post link"}>
                        <IconButton sx={{ padding: "4px" }} onClick={handleLinkCopied}>
                            {linkCopied ?
                                <DoneAll />
                                :
                                <Link />
                            }
                        </IconButton>
                    </Tooltip>
                    {individual && user && (user._id === authorId) &&
                        <Box sx={{ display: { xs: "block", sm: "none" } }}>{otherOpertionsContainer()}</Box>
                    }
                </Paper>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>{otherOpertionsContainer()}</Box>
            </Box>
        </>
    );
};

export default PostOperations;