import React, { useState, useEffect, useContext } from "react";
import { Avatar, Box, Button, IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { MoreHoriz, AddCommentRounded, DeleteTwoTone, EditNoteRounded, RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing my components
import { formatTime } from "../../utils/functions";
import InputField from "../InputField/InputField";
// Importing contexts
import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialog.context";
import { SnackBarContext } from "../../contexts/SnackBar.context";
// Importing actions
import { deleteComment, createReply, fetchReplies } from "../../actions/comment";
// Importing styling
import styles from "./styles";

function Comment(props) {
    const { user, authorId, commentData, intendation } = props;
    const { _id, postId, userId, parentId, comment, repliesCount, userDetails, createdAt } = commentData;
    const { userName, avatar } = userDetails;
    const { openDialog } = useContext(ConfirmationDialogContext);
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    function handleClickMenu(event) {
        setAnchorEl(event.currentTarget);
    };
    function handleCloseMenu() {
        setAnchorEl(null);
    };
    async function handleDelete() {
        const { status, result } = await dispatch(deleteComment({ _id }));
        if (status === 200) {
            commentData.comment = "[Deleted]"
        } else {
            setSnackbarValue({ message: result.message, status: "error" });
            setSnackbarState(true);
        }
        handleCloseMenu();
    }
    const [openReply, setOpenReply] = useState(false);
    function handleOpenReply() {
        if (user) { setOpenReply(true) }
        else { navigate("/authentication") }
    }
    const [reply, setReply] = useState("");
    function handleReplyChange(event) {
        const { value } = event.target;
        setReply(value);
    }
    const [replies, setReplies] = useState([]);
    const [hideReplies, setHideReplies] = useState(false);
    const [updatedIntendation, setUpdatedIntendation] = useState(intendation || 0);
    useEffect(() => {
        async function fetchAllReplies() {
            const { status, result } = await dispatch(fetchReplies({ postId: postId, parentId: _id }));
            if (status === 200) {
                setReplies(result);
            }
        }
        if (repliesCount !== 0 && updatedIntendation < 3) { fetchAllReplies() }
    }, [_id, repliesCount, postId, updatedIntendation, dispatch]);
    async function handleAddReply() {
        const { status, result } = await dispatch(createReply({ postId: postId, userId: user._id, comment: reply, parentId: _id }));
        if (status === 200) {
            setReplies(prevReplies => {
                prevReplies.push(result);
                return prevReplies;
            });
            setOpenReply(false);
            setReply("");
        } else {
            setSnackbarValue({ message: result.message, status: "error" });
            setSnackbarState(true);
        }
    }
    function handleCancelReply() {
        if (reply.trim() !== "") {
            openDialog({
                title: "Discard reply",
                message:
                    <span>
                        Are you sure you want to discard your comment? This action cannot be undone.
                        <br /><br />
                        Proceed?
                    </span>,
                cancelBtnText: "Cancel", submitBtnText: "Discard", dialogId: 7,
                rest: { setReply, setOpenReply }
            });
        }
        else {
            setOpenReply(false);
        }
    }
    function resetIntendation() {
        setUpdatedIntendation(0);
    }
    function toggleHideReplies() {
        setHideReplies(!hideReplies);
    }

    return (
        <>
            <Box sx={{ marginLeft: { xs: `${updatedIntendation * 32}px`, md: `${updatedIntendation * 48}px` } }}>
                <Box sx={{ display: "flex", gap: "12px", alignItems: "top", marginTop: parentId === null ? "8px" : "4px" }}>
                    <Box sx={classes.avatarContainer}>
                        <Avatar src={avatar} sx={classes.avatar}>{userName.charAt(0)}</Avatar>
                        {(repliesCount > 0) &&
                            <>
                                {hideReplies ?
                                    <AddCircleOutline sx={{ ...classes.icon, fontSize: { xs: "12px", sm: "24px" } }} onClick={toggleHideReplies} />
                                    :
                                    <RemoveCircleOutline sx={{ ...classes.icon, fontSize: { xs: "12px", sm: "24px" } }} onClick={toggleHideReplies} />
                                }
                            </>
                        }
                    </Box>
                    <Box sx={{ width: "100%" }}>
                        <Box sx={classes.userDetailsContainer}>
                            {userDetails.isDeleted ?
                                <span style={{ fontSize: "14px" }}><span style={{ fontSize: "12px" }}>e/</span>[Deleted]</span>
                                :
                                <span style={{ fontSize: "14px", cursor: "pointer", fontWeight: "bold" }} onClick={() => navigate(`/e/${userName}`)}>
                                    <span style={{ fontSize: "13px" }}>e/</span>{userName}
                                </span>
                            }
                            <Typography sx={{ fontSize: "12px" }}>{formatTime(createdAt)} ago </Typography>
                            {user && userId === authorId &&
                                <Typography sx={{ fontSize: "12px", color: "#0090c1" }}> author</Typography>
                            }
                        </Box>
                        <Typography sx={{ fontSize: "14px", wordBreak: "break-word", whiteSpace: "pre-line" }}>{comment}</Typography>
                        <Box sx={classes.replyContainer}>
                            {openReply ?
                                <Box sx={{ width: "100%" }}>
                                    <InputField
                                        name="reply" value={reply} label="Your reply"
                                        handleChange={handleReplyChange} autoFocus={true} multiline={true} rows="auto"
                                        sx={{ bgcolor: "background.secondary" }}
                                    />
                                    <Box sx={{ display: "flex", gap: "8px", justifyContent: "end", margin: "8px auto" }}>
                                        <Button variant="outlined" sx={classes.replyCancelBtn} onClick={handleCancelReply}>Cancel</Button>
                                        <Button variant="contained" sx={classes.replyAddBtn} onClick={handleAddReply}>Add</Button>
                                    </Box>
                                </Box>
                                :
                                <Box sx={classes.icon} onClick={handleOpenReply}>
                                    <AddCommentRounded sx={{ fontSize: "16px" }} />
                                    <span style={classes.iconText}>Reply</span>
                                </Box>
                            }
                            {user && user._id === userId &&
                                <Box>
                                    <IconButton onClick={handleClickMenu}>
                                        <MoreHoriz sx={{ fontSize: { xs: "16px", md: "20px" } }} />
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
                                            Delete
                                        </MenuItem>
                                        <MenuItem disabled onClick={handleCloseMenu}>
                                            <ListItemIcon>
                                                <EditNoteRounded fontSize="small" />
                                            </ListItemIcon>
                                            Edit
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box>
                {replies.map((reply, index) => {
                    return (
                        <Box key={index} sx={{ display: hideReplies && "none" }}>
                            <Comment
                                user={user} authorId={authorId}
                                commentData={reply} intendation={updatedIntendation + 1}
                            />
                        </Box>
                    )
                })}
                {(updatedIntendation > 2) && (repliesCount > 0) &&
                    <Box
                        sx={{ marginLeft: { xs: `${updatedIntendation * 16}px`, sm: `${updatedIntendation * 32}px`, md: `${updatedIntendation * 48}px` }, paddingLeft: "72px" }}
                        onClick={resetIntendation}
                    >
                        <i>Load more...</i>
                    </Box>
                }
            </Box>
        </>
    );
};

export default Comment;