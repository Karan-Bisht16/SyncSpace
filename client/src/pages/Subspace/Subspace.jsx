import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// Importing my components
// Importing actions
// Importing styling
import styles from "./styles";

function Subspace(props) {
    const { user } = props;
    const { id } = useParams();
    const classes = styles();
    const dispatch = useDispatch();
    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace";
    }, []);

    const tempUser = useSelector((state) => (state.user));
    console.log(tempUser);

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <Typography>{id}</Typography>
            </Box>
        </Grid>
    );
}

export default Subspace;