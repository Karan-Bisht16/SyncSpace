import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// Importing my components
import Posts from "../../Components/Posts/Posts";
// Importing actions
import { getPosts } from "../../actions/post"
// Importing styling
import styles from "./styles";

function Home(props) {
    const { setSnackbarValue, setSnackbarState } = props;
    const classes = styles();
    const dispatch = useDispatch();

    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace";
    });
    const posts = useSelector((state) => state.posts);
    useEffect(() => {
        dispatch(getPosts());
    }, [dispatch]);

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <Posts posts={posts} setSnackbarValue={setSnackbarValue} setSnackbarState={setSnackbarState} />
            </Box>
        </Grid>
    );
}

export default Home;