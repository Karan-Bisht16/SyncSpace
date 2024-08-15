import React, { useState, useContext } from "react";
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Paper } from "@mui/material";
import { CommentOutlined, DeleteTwoTone, DoneAll, AppRegistration, Favorite, FavoriteBorderOutlined, Link, MoreHoriz } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// Importing contexts
import { SnackBarContext } from "../../../../contexts/SnackBar.context";
import { ConfirmationDialogContext } from "../../../../contexts/ConfirmationDialog.context";

function PostOperations(props) {
    const { classes, user, post, individual, postLiked, postLikesCount, handleLike, handlePostClick } = props;
    const { _id, authorId, commentsCount } = post;
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const { openDialog } = useContext(ConfirmationDialogContext);
    const navigate = useNavigate();

    const [linkCopied, setLinkCopied] = useState(false);
    function handleLinkCopied() {
        if (individual) {
            navigator.clipboard.writeText(window.location.href)
        } else {
            navigator.clipboard.writeText(process.env.REACT_APP_DOMAIN + "/post/" + _id);
        }
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
            cancelBtnText: "Cancel", submitBtnText: "Delete", type: "error", dialogId: 2,
            rest: { navigate, _id }

        });
    }
    function otherOpertionsContainer() {
        return (
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
                    <MenuItem onClick={handleLinkCopied}>
                        <ListItemIcon>
                            {linkCopied ?
                                <DoneAll fontSize="small" />
                                :
                                <Link fontSize="small" />
                            }
                        </ListItemIcon>
                        {linkCopied ? "Post link copied" : <span>Copy post link &nbsp;</span>}
                    </MenuItem>
                    {user && (user._id === authorId) &&
                        <MenuItem onClick={handleEdit}>
                            <ListItemIcon>
                                <AppRegistration fontSize="small" />
                            </ListItemIcon>
                            Edit post
                        </MenuItem>
                    }
                    {user && (user._id === authorId) &&
                        <MenuItem onClick={handleDelete}>
                            <ListItemIcon>
                                <DeleteTwoTone fontSize="small" />
                            </ListItemIcon>
                            Delete post
                        </MenuItem>
                    }
                </Menu>
            </Box>
        );
    }

    return (
        <Paper sx={classes.allPostActionsContainer}>
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
            {otherOpertionsContainer()}
        </Paper>
    );
};

export default PostOperations;