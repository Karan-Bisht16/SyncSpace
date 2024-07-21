import React, { useState, useEffect } from "react";
import { Box, Button, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { lineSpinner } from "ldrs"
// Importing my components
import NotFound from "../../Components/NotFound/NotFound";
import Post from "../../Components/Posts/Post/Post";
// Importing actions
import { fetchPostInfo } from "../../actions/post";
// Importing styling
import styles from "./styles";

function PostContainer(props) {
    const { user, snackbar, confirmationDialog } = props;
    const [setSnackbarValue, setSnackbarState] = snackbar;
    const { id } = useParams();
    const classes = styles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [redirect, setRedirect] = useState(true);
    const [primaryLoading, setPrimaryLoading] = useState(true);
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
            // change this
            setComments([]);
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
    const [addComment, setAddComment] = useState(false);
    function handleAddComment() {
        console.log("hey");
    }
    function handleOpenComment() {
        if (user) { setAddComment(true) }
        else { navigate("/authentication") }
    }
    function handleCancelComment() {
        setAddComment(false);
    }
    lineSpinner.register("l-loader");

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
                                    <Post post={postData} individual={true} redirect={redirect} snackbar={snackbar} confirmationDialog={confirmationDialog} />
                                    {secondaryLoading ?
                                        <Box sx={classes.noCommentsContainer}>
                                            <l-loader size="75" speed="1.75" color="#0090c1" />
                                        </Box>
                                        :
                                        <>
                                            {addComment ?
                                                <>
                                                    <Box sx={classes.addCommentContainer}>
                                                        {/* use InputField here after you make it a controlled input */}
                                                        <TextField
                                                            label="Your comment"
                                                            sx={{ bgcolor: "background.secondary", width: "95%" }}
                                                            autoFocus multiline rows={3}
                                                        />
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: "8px", justifyContent: "end", width: "95%", margin: "8px auto" }}>
                                                        <Button variant="outlined" sx={classes.commentBtn} onClick={handleCancelComment}>Cancel</Button>
                                                        <Button variant="contained" sx={classes.commentBtn} onClick={handleAddComment}>Add</Button>
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
                                                    hey
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
        </Grid>
    );
}

export default PostContainer;