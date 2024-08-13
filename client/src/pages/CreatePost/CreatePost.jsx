import React, { useState, useEffect } from "react";
import { Autocomplete, Box, Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
// Importing my components
import PostForm from "../../Components/PostForm/PostForm";
// Importing styling
import styles from "./styles";

function CreatePost(props) {
    const { user } = props;
    const classes = styles();
    const location = useLocation();

    useEffect(() => {
        document.title = "SyncSpace: Create Post";
    }, []);

    const [postData, setPostData] = useState({
        subspaceId: "",
        authorId: user._id,
        title: "",
        body: "",
    });
    const [selectedFile, setSelectedFile] = useState([]);
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
    const joinedSubspaces = useSelector(state => state.subspaces);
    useEffect(() => {
        setSubspacesArray(joinedSubspaces);
        setLoadingSubspace(false);
    }, [joinedSubspaces]);

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box id="postForm" sx={classes.mainContainer}>
                <Typography variant="h4">Create Post</Typography>
                <div style={classes.autocompleteField}>
                    {hasPredefinedSubspace ?
                        <TextField
                            readOnly disabled id="standard-basic" label={previousSubspace} variant="standard"
                            sx={classes.autocompleteWidth}
                        />
                        :
                        <>
                            {loadingSubspace ?
                                <>
                                    <TextField disabled id="standard-basic" label="Subspace" variant="standard" />
                                    <LinearProgress sx={classes.progressBar} />
                                </>
                                :
                                <Autocomplete
                                    disablePortal
                                    value={subspace}
                                    id="combo-box-demo"
                                    options={subspacesArray}
                                    sx={classes.autocompleteWidth}
                                    renderInput={(params) => <TextField {...params} variant="standard" label="Subspace" />}
                                    onChange={(event, newValue) => {
                                        setSubspace(newValue);
                                        setPostData(prevPostData => {
                                            return { ...prevPostData, "subspaceId": newValue?._id, "subspaceName": newValue?.label }
                                        })
                                    }}
                                />
                            }
                        </>
                    }
                </div>
                <PostForm
                    postData={postData} setPostData={setPostData} selectedFile={selectedFile} setSelectedFile={setSelectedFile}
                    predefinedTabIndex="1" type="Post" hasPredefinedSubspace={hasPredefinedSubspace} subspacesArray={subspacesArray}
                />
            </Box>
        </Grid>
    );
}

export default CreatePost;