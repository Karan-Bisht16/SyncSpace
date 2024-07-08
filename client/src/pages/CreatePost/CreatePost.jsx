import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
// Importing my components
import PostForm from "../../Components/PostForm/PostForm";
// Importing styling
import styles from "./styles";

function CreatePost(props) {
    const { user } = props;
    const classes = styles();
    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace: Create Post";
    });

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box id="postForm" sx={classes.mainContainer}>
                <Typography variant="h4">Create Post</Typography>
                <PostForm user={user} />
            </Box>
        </Grid>
    );
}

export default CreatePost;