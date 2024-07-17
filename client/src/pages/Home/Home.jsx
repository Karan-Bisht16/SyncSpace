import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
// Importing my components
import Posts from "../../Components/Posts/Posts";
// Importing styling
import styles from "./styles";

function Home(props) {
    const { snackbar, confirmationDialog } = props;
    const classes = styles();

    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace";
    });

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <Posts searchQuery={null} customParams="HOME_PAGE" snackbar={snackbar} confirmationDialog={confirmationDialog} />
            </Box>
        </Grid>
    );
}

export default Home;