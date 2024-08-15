import React, { useState, useEffect, useContext } from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { lineSpinner } from "ldrs";
// Importing my components
import PostForm from "../../Components/PostForm/PostForm";
import NotFound from "../../Components/NotFound/NotFound";
// Importing contexts
import { SnackBarContext } from "../../contexts/SnackBar.context";
// Importing actions
import { fetchPostInfo } from "../../actions/post";
// Importing styling
import styles from "./styles";

function EditPost(props) {
    const { user } = props;
    const { id } = useParams();
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const classes = styles();
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
    const [selectedFile, setSelectedFile] = useState([]);
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
                });
                setSelectedFile(result.selectedFile);
                setAllPostFormDataSet(true);
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        }
        if (location?.state && location.state.post) {
            const postData = location.state.post;
            if (postData.authorId === user._id) { setValidation(true) }
            setPreviousSubspace(postData.subspaceDetails.subspaceName);
            if (!postData.body || postData.body === "") { setPredefinedTabIndex("2") }
            setPostFormData({
                title: postData.title,
                body: postData.body,
            });
            setSelectedFile(postData.selectedFile);
            setAllPostFormDataSet(true);
        } else {
            getPostInfo();
        }
    }, [location.state, id, user._id, dispatch, setSnackbarValue, setSnackbarState]);

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <Typography variant="h4">Edit Post</Typography>
                {allPostFormDataSet ?
                    <>
                        {validation ?
                            <>
                                <TextField
                                    readOnly disabled id="standard-basic" label={previousSubspace} variant="standard"
                                    sx={{ width: "300px", padding: "4px 0 8px 0" }}
                                />
                                <PostForm
                                    postData={postFormData} setPostData={setPostFormData} selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                                    predefinedTabIndex={predefinedTabIndex} type="Edit" hasPredefinedSubspace={true} postId={id}
                                />
                            </>
                            :
                            <NotFound
                                mainText="Unauthorised access"
                                link={{ linkText: "Go home", to: "/", state: {} }}
                            />
                        }
                    </>
                    :
                    <Box sx={classes.loadingContainer}>
                        <l-loader size="75" speed="1.75" color="#0090c1" />
                    </Box>
                }
            </Box>
        </Grid>
    );
}

export default EditPost;