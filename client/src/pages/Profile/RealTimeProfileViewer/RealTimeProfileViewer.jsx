import React from "react";
import { Box, Divider, Grid, Typography } from "@mui/material";
// Importing my components
import { formatDate } from "../../../utils/functions";
// Importing styling
import styles from "./styles";

function RealTimeProfileViwer(props) {
    const { formData, user } = props;
    const classes = styles();

    function gridItemContainer(size, value, singularTitle, pluralTitle) {
        return (
            <Grid item xs={size}>
                <Box sx={classes.gridItemBox}>
                    <Typography>{value}</Typography>
                    <Typography sx={classes.gridItemTitle}>{value === 1 ? singularTitle : pluralTitle}</Typography>
                </Box>
            </Grid>
        );
    }

    return (
        <Grid item xs={12} lg={3} sx={classes.profileContainer}>
            <Box sx={{ height: "48.01300px" }}></Box>
            <Box sx={classes.formDataContainer}>
                <Typography variant="h6">{formData.name}</Typography>
                <p style={{ fontSize: "10px", margin: "0" }}>e/{formData.name.replace(/ /g, "-")}</p>
            </Box>
            <Box sx={classes.gridItemBox}>
                <Typography>{formatDate(user.dateJoined)}</Typography>
                <Typography sx={classes.gridItemTitle}>Explorer since</Typography>
            </Box>
            <Grid container>
                {gridItemContainer(5, user.postsCount, "Post", "Posts")}
                {gridItemContainer(2, "", "")}
                {gridItemContainer(5, user.credits, "Celestial Credit", "Celestial Credits")}
                {gridItemContainer(12, user.subspacesJoined, "Subspace joined", "Subspaces joined")}
            </Grid>
            <br />
            <Divider />
            <Box sx={classes.bioContainer}>
                {formData.bio}
            </Box>
            <Typography sx={{ fontSize: "12px", paddingTop: "4px" }}>Bio</Typography>
        </Grid >
    );
}

export default RealTimeProfileViwer;