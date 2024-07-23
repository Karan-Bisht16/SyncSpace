import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
// Importing my components
import Posts from "../../Components/Posts/Posts";
// Importing styling
import styles from "./styles";

function Trending() {
    const classes = styles();

    useEffect(() => {
        document.title = "SyncSpace: Trending";
    }, []);

    const [reRenderTrending, setReRenderTrending] = useState({});
    useEffect(() => {
        setReRenderTrending({});
    }, []);

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <Posts searchQuery={reRenderTrending} customParams="TRENDING_PAGE" />
            </Box>
        </Grid>
    );
}

export default Trending;