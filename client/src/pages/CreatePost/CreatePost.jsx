import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
// Importing my components
import PostForm from "../../Components/PostForm/PostForm";
// Importing styling
import styles from "./styles";

function CreatePost(props) {
    const { user } = props;
    const classes = styles();
    const location = useLocation();

    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace: Create Post";
    }, []);

    const [usePreviousSubspace, setUsePreviousSubspace] = useState(false);
    if (location.state && location.state.subspaceName && !usePreviousSubspace) {
        setUsePreviousSubspace(location.state.subspaceName);
    }

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box id="postForm" sx={classes.mainContainer}>
                <Typography variant="h4">Create Post</Typography>
                <PostForm user={user} previousSubspace={usePreviousSubspace} />
            </Box>
        </Grid>
    );
}

export default CreatePost;