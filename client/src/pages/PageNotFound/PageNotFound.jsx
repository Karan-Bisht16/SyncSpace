import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
// Importing styling
import styles from "./styles";
// Importing images
import NotFound from "../../images/img-not-found.png";

function PageNotFound() {
    const classes = styles();
    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace: 404";
    }, []);

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <img style={classes.image} src={NotFound} alt="Page not found"></img>
                <Typography sx={{ fontSize: { xs: "32px", md: "60px" } }}>Page not found</Typography>
                <Typography component={Link} to="/" sx={classes.link}>Go back</Typography>
            </Box>
        </Grid>
    )
}

export default PageNotFound;