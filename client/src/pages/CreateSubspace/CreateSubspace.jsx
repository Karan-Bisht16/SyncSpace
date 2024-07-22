import React, { useEffect } from "react";
import { Box, Grid } from "@mui/material";
// Importing my components
import SubspaceForm from "../../Components/SubspaceForm/SubspaceForm";
// Importing styling
import styles from "./styles";

function CreateSubspace(props) {
    const { user } = props;
    const classes = styles();

    useEffect(() => {
        document.title = "SyncSpace: Create Subspace";
    }, []);

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <SubspaceForm user={user} type="Create" />
                <Box sx={classes.postContainer} />
            </Box>
        </Grid>
    );
}

export default CreateSubspace;