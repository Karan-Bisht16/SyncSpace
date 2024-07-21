import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { lineSpinner } from "ldrs";
// Importing my components
import PostForm from "../../Components/PostForm/PostForm";
import NotFound from "../../Components/NotFound/NotFound";
// Importing styling
import styles from "./styles";
import { fetchPostInfo } from "../../actions/post";
import { useDispatch } from "react-redux";

function EditPost(props) {
    const { user, snackbar, confirmationDialog } = props;
    const { setSnackbarValue, setSnackbarState } = snackbar;
    const classes = styles();
    const { id } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    lineSpinner.register("l-loader");

    useEffect(() => {
        document.title = "SyncSpace: Edit Post";
    }, []);

    const [postFormData, setPostFormData] = useState({
        title: "",
        body: "",
        selectedFile: [],
    });
    const [validation, setValidation] = useState(false);
    const [predefinedTabIndex, setPredefinedTabIndex] = useState("1");
    const [previousSubspace, setPreviousSubspace] = useState(false);
    const [allPostFormDataSet, setAllPostFormDataSet] = useState(false);
    useEffect(() => {
        async function getPostInfo() {
            const { status, result } = await dispatch(fetchPostInfo({ id }));
            if (status === 200) {
                if (result.authorId === user._id) { setValidation(true) }
                setPreviousSubspace(result.subspaceDetails.subspaceName);
                if (!result.body || result.body === "") { setPredefinedTabIndex("2") }
                setPostFormData({
                    title: result.title,
                    body: result.body,
                    selectedFile: result.selectedFile,
                });
                setAllPostFormDataSet(true);
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        }
        if (location.state && location.state.post) {
            const postData = location.state.post;
            if (postData.authorId === user._id) { setValidation(true) }
            setPreviousSubspace(postData.subspaceDetails.subspaceName);
            if (!postData.body || postData.body === "") { setPredefinedTabIndex("2") }
            setPostFormData({
                title: postData.title,
                body: postData.body,
                selectedFile: postData.selectedFile,
            });
            setAllPostFormDataSet(true);
        } else {
            getPostInfo();
        }
    }, [location.state, id, user._id, dispatch, setSnackbarValue, setSnackbarState]);
    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box id="postFormForm" sx={classes.mainContainer}>
                <Typography variant="h4">Edit Post</Typography>
                <div style={{ width: 300, padding: "16px 0" }}>
                </div>
                {allPostFormDataSet ?
                    <>
                        {validation ?
                            <>
                                <TextField
                                    readOnly disabled id="standard-basic" label={previousSubspace} variant="standard"
                                    sx={{ width: 300 }}
                                />
                                <PostForm
                                    user={user} predefinedTabIndex={predefinedTabIndex} type="Edit"
                                    postData={postFormData} setPostData={setPostFormData}
                                    hasPredefinedSubspace={true} postId={id}
                                    snackbar={snackbar} confirmationDialog={confirmationDialog}
                                />
                            </>
                            :
                            <NotFound
                                img={false}
                                mainText="Unauthorised access"
                                link={{ linkText: "Go home", to: "/", state: {} }}
                            />
                        }
                    </>
                    :
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <l-loader size="75" speed="1.75" color="#0090c1" />
                    </Box>
                }
            </Box>
        </Grid>
    );
}

export default EditPost;