import React, { useState, useEffect, useContext } from "react";
import { Box, Button, Grid, LinearProgress, Typography } from "@mui/material";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { lineSpinner } from "ldrs"
// Importing my components
import ConfirmationDialog from "../../Components/ConfirmationDialog/ConfirmationDialog";
import InputField from "../../Components/InputField/InputField";
import NotFound from "../../Components/NotFound/NotFound";
import Comment from "../../Components/Comment/Comment";
import Post from "../../Components/Posts/Post/Post";
// Importing contexts
import { ConfirmationDialogContext, SnackBarContext } from "../../store";
// Importing actions
import { fetchPostInfo, deletePost } from "../../actions/post";
import { createComment, fetchComments } from "../../actions/comment";
// Importing styling
import styles from "./styles";

function PostContainer(props) {
    const { user } = props;
    const { id } = useParams();
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const { dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar } = useContext(ConfirmationDialogContext);
    const classes = styles();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    lineSpinner.register("l-loader");

    const [redirect, setRedirect] = useState(true);
    const [primaryLoading, setPrimaryLoading] = useState((location?.state === null) ? true : false);
    const [secondaryLoading, setSecondaryLoading] = useState(true);
    const [noPostFound, setNoPostFound] = useState(false);
    const [comments, setComments] = useState([]);
    const [postData, setPostData] = useState({
        _id: id,
        title: "Loading...",
        body: "Loading...",
        selectedFile: [],
        dateCreated: "Loading...",
        edited: false,
        likesCount: 0,
        commentsCount: 0,
        authorId: "Loading...",
        subspaceDetails: {
            subspaceName: "Loading...",
            avatar: "",
            isDeleted: false,
        },
        authorDetails: {
            userName: "Loading...",
            isDeleted: false,
        }
    });
    useEffect(() => {
        async function fetchCommentsInfo() {
            const { status, result } = await dispatch(fetchComments({ id }));
            if (status === 200) {
                setComments(result);
            } else {
                setComments([]);
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
            setSecondaryLoading(false);
        }
        async function fetchAllPostInfo() {
            const { status, result } = await dispatch(fetchPostInfo({ id }));
            if (status === 200) {
                setPostData(result);
                setPrimaryLoading(false);
                document.title = "SyncSpace: " + result.title;
            } else if (status === 404) {
                setNoPostFound(true);
                setPrimaryLoading(false);
                setSecondaryLoading(false);
                document.title = "SyncSpace: No such post";
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        }
        async function getPostInfo() {
            if (location && location.state) {
                const { post } = location.state.postData;
                if (post) {
                    setPostData(post);
                    setPrimaryLoading(false);
                    setRedirect(false);
                    document.title = "SyncSpace: " + post.title;
                } else {
                    fetchAllPostInfo();
                }
            } else {
                fetchAllPostInfo();
            }
        }
        getPostInfo();
        fetchCommentsInfo();
    }, [id, location, dispatch, setSnackbarValue, setSnackbarState]);
    const [comment, setComment] = useState("");
    function handleCommentChange(event) {
        const { value } = event.target;
        setComment(value);
    }
    const [addComment, setAddComment] = useState(false);
    function handleOpenComment() {
        if (user) { setAddComment(true) }
        else { navigate("/authentication") }
    }
    function handleCancelComment() {
        if (comment.trim() !== "") {
            openDialog({
                title: "Discard comment",
                message: "Discard comment?",
                cancelBtnText: "Cancel", submitBtnText: "Discard"
            });
        }
        else {
            setAddComment(false);
        }
    }
    async function handleDialog() {
        if (dialogValue.submitBtnText.toUpperCase() === "DISCARD") {
            closeDialog();
            setAddComment(false);
            setComment("");
        } else if (dialogValue.submitBtnText.toUpperCase() === "DELETE") {
            setLinearProgressBar(true);
            try {
                const { status, result } = await dispatch(deletePost({ postId: id }));
                closeDialog();
                if (status === 200) {
                    navigate("/", { state: { message: "Post deleted.", status: "success", time: new Date().getTime() } });
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
    }
    async function handleAddComment() {
        const { status, result } = await dispatch(createComment({ postId: id, userId: user._id, comment: comment }));
        if (status === 200) {
            setComments(prevComments => {
                prevComments.push(result);
                return prevComments;
            });
            setPostData(prevPostData => {
                return { ...prevPostData, "commentsCount": prevPostData.commentsCount + 1 };
            })
            setAddComment(false);
            setComment("");
        } else {
            setSnackbarValue({ message: result.message, status: "error" });
            setSnackbarState(true);
        }
    }

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <div className="mx-auto my-10">
                    {noPostFound ?
                        <NotFound
                            img={true}
                            mainText="No such post found"
                            link={{ linkText: "Go home", to: "/", state: {} }}
                        />
                        :
                        <>
                            {primaryLoading ?
                                <Box sx={classes.primaryLoadingScreenStyling}>
                                    <Typography sx={classes.titleFont}>Fetching post</Typography>
                                    <LinearProgress sx={classes.primaryProgressBar} />
                                </Box>
                                :
                                <>
                                    <Post post={postData} individual={true} redirect={redirect} />
                                    {secondaryLoading ?
                                        <Box sx={classes.noCommentsContainer}>
                                            <l-loader size="75" speed="1.75" color="#0090c1" />
                                        </Box>
                                        :
                                        <>
                                            {addComment ?
                                                <>
                                                    <Box sx={classes.addCommentContainer}>
                                                        <InputField
                                                            name="comment" label="Your comment" value={comment} type="text"
                                                            handleChange={handleCommentChange} autoFocus={true} multiline={true} rows={3}
                                                            sx={{ bgcolor: "background.secondary", width: "95%" }}
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "8px", justifyContent: "end", width: "95%", margin: "8px auto" }}>
                                                        <Button variant="outlined" sx={classes.commentCancelBtn} onClick={handleCancelComment}>Cancel</Button>
                                                        <Button variant="contained" sx={classes.commentAddBtn} onClick={handleAddComment}>Add</Button>
                                                    </Box>
                                                </>
                                                :
                                                <Box sx={classes.addCommentBtnContainer}>
                                                    <Button sx={classes.addCommentBtn} onClick={handleOpenComment}>+ Add a comment</Button>
                                                </Box>
                                            }
                                            {comments.length === 0 ?
                                                <Box sx={classes.noCommentsContainer}>
                                                    <NotFound
                                                        mainText="No comments"
                                                        link={{ linkText: "", to: "", state: {} }}
                                                    />
                                                    <>
                                                        {!user &&
                                                            <Typography sx={classes.link} component={Link} to="/authentication">Sign up to comment</Typography>
                                                        }
                                                    </>
                                                </Box>
                                                :
                                                <Box sx={classes.commentsContainer}>
                                                    {comments.map((individualComment, index) => {
                                                        return (
                                                            <Box key={index}>
                                                                <Comment
                                                                    user={user} authorId={postData?.authorId}
                                                                    commentData={individualComment} intendation={0}
                                                                />
                                                            </Box>
                                                        )
                                                    })}
                                                </Box>
                                            }
                                        </>
                                    }
                                </>
                            }
                        </>
                    }
                </div>
            </Box>
            <ConfirmationDialog dialog={dialog} closeDialog={closeDialog} handleDialog={handleDialog} linearProgressBar={linearProgressBar} dialogValue={dialogValue} />
        </Grid>
    );
}

export default PostContainer;