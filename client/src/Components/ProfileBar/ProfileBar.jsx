import React, { useState } from "react";
import { Typography, Grid, Box, Tooltip, IconButton } from "@mui/material";
import { Link, DoneAll } from '@mui/icons-material';
// Importing my components
import SnackBar from "../SnackBar/SnackBar";
import formatDate from "../../utils/dateFormatter";
// Importing styling
import styles from "./styles";

function ProfileBar(props) {
    const { user, userPosts } = props;
    const classes = styles();

    // JS for SnackBar
    const [snackbarState, setSnackbarState] = useState(false);
    const [snackbarValue, setSnackbarValue] = useState({ message: "", status: "" });
    function handleSnackbarState(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarState(false);
    }
    const [linkCopied, setLinkCopied] = useState(false);
    function handleLinkCopied() {
        navigator.clipboard.writeText(process.env.REACT_APP_DOMAIN + "/profile/" + user.userName)
        setLinkCopied(true);
        setSnackbarState(true);
        setSnackbarValue({ message: "Link copied to clipboard", status: "info" });
    }
    function gridItemContainer(size, text, title) {
        return (
            <Grid item xs={size}>
                <Box sx={classes.gridItemBox}>
                    <Typography>{text}</Typography>
                    <Typography sx={classes.gridItemTitle}>{title}</Typography>
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
                        <IconButton sx={classes.copyLinkBtn} onClick={handleLinkCopied}>
                            <DoneAll />
                        </IconButton>
                        :
                        <IconButton sx={classes.copyLinkBtn} onClick={handleLinkCopied}>
                            <Link />
                        </IconButton>
                    }
                </Tooltip>
            </Box>
            <Box sx={{ padding: "8px 0" }}>
                <Typography>{formatDate(user.dateJoined)}</Typography>
                <Typography sx={{ fontSize: "12px" }}>Explorer since</Typography>
            </Box>
            <Grid container>
                {gridItemContainer(5, userPosts.length, "Posts")}
                {gridItemContainer(2, "", "")}
                {gridItemContainer(5, user.karma, "SubPoints")}
                {gridItemContainer(12, user.subspacesJoined.length, "Subspaces Joined")}
            </Grid>
            <Box sx={{ height: "155px", width: { xs: "100%", md: "550px", lg: "175px" }, wordBreak: "break-all", overflow: "auto", overflowWrap: "break-word", hyphens: "auto", paddingTop: "8px" }}>
                {user.bio}
            </Box>
            <Typography sx={classes.gridItemTitle}>Bio</Typography>
            <SnackBar openSnackbar={snackbarState} handleClose={handleSnackbarState} timeOut={5000} message={snackbarValue.message} type={snackbarValue.status} />
        </Grid >
    )
}

export default ProfileBar;