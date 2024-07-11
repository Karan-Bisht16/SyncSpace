import React from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";
// Importing my components
// Importing actions
// Importing styling
import styles from "./styles"

function RealTimeSubspaceViewer(props) {
    const { subspaceData } = props;
    const classes = styles();

    return (
        <Grid item xs={12} lg={3} sx={classes.profileContainer}>
            <Box sx={classes.mainContainer}>
                <Avatar src={subspaceData.avatar} alt="Subspace Avatar" >{subspaceData.name.charAt(0)}</Avatar>
                <Box sx={classes.gridItemBox}>
                    <Typography variant="h6" sx={classes.flexContainer}>
                        <span style={classes.subspaceString}>ss/</span>{subspaceData.name.trim() === "" ?
                            <Box sx={classes.customSubspaceName}><b>Your</b> subspace name</Box> :
                            subspaceData.name.trim().replace(/ /g, "-")}
                    </Typography>
                    <Typography sx={classes.gridItemTitle}>Subspace Name</Typography>
                </Box>
            </Box>
            <Box sx={classes.gridItemBox}>
                {subspaceData.description.trim() === "" ? <>Tell us about <b>your</b> subspace</> : subspaceData.description}
                <Typography sx={classes.gridItemTitle}>Description</Typography>
            </Box>
        </Grid >
    );
}

export default RealTimeSubspaceViewer;