import React from "react";
import { Avatar, Box, Grid, Typography } from "@mui/material";
// Importing styling
import styles from "./styles"

function RealTimeSubspaceViewer(props) {
    const { subspaceData, activeStep } = props;
    const classes = styles();

    let componentStyle = { display: "block" };
    if (activeStep === 2) {
        componentStyle = { display: { xs: "none", sm: "block" } };
    }

    return (
        <Grid item xs={12} lg={3} sx={Object.assign({}, classes.profileContainer, componentStyle)}>
            <Box sx={classes.mainContainer}>
                <Box sx={classes.avatarContainer}>
                    <Avatar src={subspaceData.avatar} alt="Subspace Avatar" >{subspaceData.name.charAt(0)}</Avatar>
                </Box>
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