import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
// Importing my components
import SubspaceForm from "../../Components/SubspaceForm/SubspaceForm";
// Importing styling
import styles from "./styles";

function UpdateSubspace(props) {
    const { user, snackbar, confirmationDialog } = props;
    const { subspaceName } = useParams();
    const classes = styles();
    const location = useLocation();

    useEffect(() => {
        document.title = `SyncSpace: Update ss/${subspaceName}`;
    }, [subspaceName]);

    const [subspaceFormData, setSubspaceFormData] = useState(null);
    useEffect(() => {
        if (location && location.state) {
            const { subspaceData } = location.state;
            if (subspaceData) {
                setSubspaceFormData(subspaceData);
            }
        }
    }, [location]);

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <SubspaceForm
                    user={user} type="Update" subspaceFormData={subspaceFormData}
                    snackbar={snackbar} confirmationDialog={confirmationDialog}
                />
                <Box sx={Object.assign({ display: "none" }, classes.postContainer)} />
            </Box>
        </Grid>
    );
}

export default UpdateSubspace;