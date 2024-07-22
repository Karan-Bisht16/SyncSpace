import React, { useState, useContext } from "react";
import { Box, Divider, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Link, DoneAll } from "@mui/icons-material";
// Importing my components
import { formatDate } from "../../utils/functions";
import { SnackBarContext } from "../../store/index";
// Importing styling
import styles from "./styles";

function ProfileBar(props) {
    const { user } = props;
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const classes = styles();

    const [linkCopied, setLinkCopied] = useState(false);
    function handleLinkCopied() {
        navigator.clipboard.writeText(process.env.REACT_APP_DOMAIN + "/e/" + user.userName)
        setLinkCopied(true);
        setSnackbarState(true);
        setSnackbarValue({ message: "Link copied to clipboard", status: "info" });
    }
    function gridItemContainer(size, value, singularTitle, pluralTitle) {
        return (
            <Grid item xs={size}>
                <Box sx={classes.gridItemBox}>
                    {value === 0 ? <Typography>{value}</Typography> : <Typography>{value || "Loading..."}</Typography>}
                    <Typography sx={classes.gridItemTitle}>{value === 1 ? singularTitle : pluralTitle}</Typography>
                </Box>
            </Grid>
        );
    }

    return (
        <Grid item xs={12} lg={3} sx={classes.profileContainer}>
            <Box sx={classes.mainContainer}>
                <Typography variant="h5">{user.name}</Typography>
                <Tooltip title={linkCopied ? "Profile link copied" : "Copy profile link"}>
                    {linkCopied ?
                        <IconButton sx={classes.copyLinkBtn} onClick={handleLinkCopied}><DoneAll /></IconButton>
                        :
                        <IconButton sx={classes.copyLinkBtn} onClick={handleLinkCopied}><Link /></IconButton>
                    }
                </Tooltip>
            </Box>
            <Box sx={classes.gridItemBox}>
                <Typography>{formatDate(user.dateJoined)}</Typography>
                <Typography sx={classes.gridItemTitle}>Explorer since</Typography>
            </Box>
            <Grid container>
                {gridItemContainer(5, user.postsCount, "Record", "Records")}
                {gridItemContainer(2, " ", "")}
                {gridItemContainer(5, user.credits, "Celestial Credit", "Celestial Credits")}
                {gridItemContainer(12, user.subspacesJoined, "Subspace joined", "Subspaces joined")}
            </Grid>
            <br />
            <Divider />
            <Box sx={classes.bioContainer}>{user.bio}</Box>
            <Typography sx={{ fontSize: "12px", paddingTop: "4px" }}>Bio</Typography>
        </Grid >
    )
}

export default ProfileBar;