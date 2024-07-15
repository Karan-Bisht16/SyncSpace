import React, { useState, useEffect } from "react";
import { Box, Button, Grid, LinearProgress, Typography } from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
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
    const { user, setSnackbarValue, setSnackbarState } = props;
    const { id } = useParams();
    const classes = styles();
    const dispatch = useDispatch();
    const location = useLocation();

    const [redirect, setRedirect] = useState(true);
    const [primaryLoading, setPrimaryLoading] = useState(true);
    const [secondaryLoading, setSecondaryLoading] = useState(true);
    const [noPostFound, setNoPostFound] = useState(false);
    const [commentsFound, setCommentsFound] = useState(false);
    const [postData, setPostData] = useState({
        authorName: "Loading...",
        subspaceName: "",
        title: "Loading...",
        body: "Loading...",
        selectedFile: [],
        dateCreated: "Loading...",
        edited: false,
        likes: "",
        comments: [],
        commentsCount: "",
    });
    useEffect(() => {
        async function fetchAllPostInfo() {
            const { status, result } = await dispatch(fetchPostInfo(id));
            if (status === 200) {
                if (result) {
                    setPostData(result);
                    setPrimaryLoading(false);
                    setCommentsFound(result.comments);
                    setSecondaryLoading(false);
                    document.title = "SyncSpace: " + result.title;
                } else {
                    setNoPostFound(true);
                    setPrimaryLoading(false);
                    setSecondaryLoading(false);
                    document.title = "SyncSpace: No such post";
                }
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        }
        async function getPostInfo() {
            if (location && location.state) {
                const desiredPost = location.state.post;
                if (desiredPost) {
                    setPostData(desiredPost);
                    setPrimaryLoading(false);
                    setRedirect(false);
                    fetchAllPostInfo();
                } else {
                    fetchAllPostInfo();
                }
            } else {
                fetchAllPostInfo();
            }
        }
        getPostInfo();
    }, [id, location, dispatch, setSnackbarValue, setSnackbarState]);
    lineSpinner.register("l-loader");

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <div className="container mx-auto my-10">
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
                                    <Post post={postData} individual={true} redirect={redirect} setSnackbarValue={setSnackbarValue} setSnackbarState={setSnackbarState} />
                                    {secondaryLoading ?
                                        <Box sx={classes.noCommentsContainer}>
                                            <l-loader size="75" speed="1.75" color="#0090c1" />
                                        </Box>
                                        :
                                        <>
                                            <Button sx={classes.addCommentBtn}>+ Add a comment</Button>
                                            {commentsFound.length === 0 ?
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
                                                    huh
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