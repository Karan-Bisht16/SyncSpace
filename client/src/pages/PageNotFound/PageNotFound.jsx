import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
// Importing my components
import NotFound from "../../Components/NotFound/NotFound";
// Importing styling
import styles from "./styles";

function PageNotFound() {
    const classes = styles();
    useEffect(() => {
        document.title = "SyncSpace: 404";
    }, []);

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <NotFound
                    img={true} mainText="Page Not Found"
                    link={{ linkText: "Go home", to: "/", state: {} }}
                />
            </Box>
        </Grid>
    )
}

export default PageNotFound;