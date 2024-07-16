import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
// Importing my components
import PostForm from "../../Components/PostForm/PostForm";
// Importing styling
import styles from "./styles";

function CreatePost(props) {
    const { user, setSnackbarValue, setSnackbarState } = props;
    const classes = styles();
    const location = useLocation();

    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace: Create Post";
    }, []);

    const [postData, setPostData] = useState({
        subspaceId: "",
        subspaceName: "",
        authorId: user._id,
        authorName: user.userName,
        title: "",
        body: "",
        selectedFile: [],
    });
    // JS for already set subspace
    const [hasPredefinedSubspace, setHasPredefinedSubspace] = useState(false);
    const [previousSubspace, setPreviousSubspace] = useState(false);
    useEffect(() => {
        if (location.state && location.state.subspaceName && location.state.subspaceId) {
            setPreviousSubspace(location.state.subspaceName);
            setHasPredefinedSubspace(true);
            setPostData(prevPostData => {
                return { ...prevPostData, "subspaceId": location.state.subspaceId, "subspaceName": location.state.subspaceName }
            })
        }
    }, [location.state]);
    // JS for undefined subspace
    const [subspace, setSubspace] = useState(null);
    const [subspacesArray, setSubspacesArray] = useState(null);
    const [loadingSubspace, setLoadingSubspace] = useState(true);
    useEffect(() => {
        const userSubspaces = user.subspacesJoined.map((subspace) => {
            return { label: subspace.name, _id: subspace._id }
        });
        setSubspacesArray(userSubspaces);
        setLoadingSubspace(false);
    }, [user.subspacesJoined]);

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box id="postForm" sx={classes.mainContainer}>
                <Typography variant="h4">Create Post</Typography>
                <div style={{ width: 300, padding: "16px 0" }}>
                    {hasPredefinedSubspace ?
                        <TextField
                            readOnly disabled id="standard-basic" label={previousSubspace} variant="standard"
                            sx={{ width: 300 }}
                        />
                        :
                        <>
                            {loadingSubspace ?
                                <>
                                    <TextField disabled id="standard-basic" label="Subspace" variant="standard" />
                                    <LinearProgress sx={{ top: "-2.5px", height: "2.5px" }} />
                                </>
                                :
                                <Autocomplete
                                    disablePortal
                                    value={subspace}
                                    id="combo-box-demo"
                                    options={subspacesArray}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} variant="standard" label="Subspace" />}
                                    onChange={(event, newValue) => {
                                        setSubspace(newValue);
                                        setPostData(prevPostData => {
                                            return { ...prevPostData, "subspaceId": newValue._id, "subspaceName": newValue.label }
                                        })
                                    }}
                                />
                            }
                        </>
                    }
                </div>
                <PostForm
                    user={user}
                    postData={postData} setPostData={setPostData}
                    hasPredefinedSubspace={hasPredefinedSubspace}
                    setSnackbarValue={setSnackbarValue} setSnackbarState={setSnackbarState}
                />
            </Box>
        </Grid>
    );
}

export default CreatePost;