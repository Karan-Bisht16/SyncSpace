import React, { useState, useContext } from "react";
import { Box, Chip, Divider, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { DoneAll, Link } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// Importing my components
import { formatDate } from "../../../utils/functions";
// Importing contexts
import { SnackBarContext } from "../../../store";

function SubspaceProfileBar(props) {
    const { classes, subspaceData } = props;
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const navigate = useNavigate();

    const [linkCopied, setLinkCopied] = useState(false);
    function handleLinkCopied() {
        navigator.clipboard.writeText(process.env.REACT_APP_DOMAIN + "/ss/" + subspaceData.subspaceName)
        setLinkCopied(true);
        setSnackbarState(true);
        setSnackbarValue({ message: "Link copied to clipboard", status: "info" });
    }
    function gridItemContainer(size, value, singularTitle, pluralTitle) {
        return (
            <Grid item xs={size}>
                <Box sx={classes.gridItemBox}>
                    {value === 0 ? <Typography sx={classes.gridItemValue}>{value}</Typography> : <Typography sx={classes.gridItemValue}>{value || "Loading..."}</Typography>}
                    <Typography sx={classes.gridItemTitle}>{value === 1 ? singularTitle : pluralTitle}</Typography>
                </Box>
            </Grid>
        );
    }

    return (
        <Box sx={{ bgcolor: "background.secondary", padding: "12px", borderRadius: "16px" }}>
            <Box sx={classes.aboutMainContainer}>
                <Typography variant="h5" sx={{ marginBottom: "4px" }}><span style={classes.subspaceString}>ss/</span>{subspaceData.name.replace(/ /g, "-")}</Typography>
                <Tooltip title={linkCopied ? "Profile link copied" : "Copy profile link"}>
                    {linkCopied ?
                        <IconButton sx={classes.copyLinkBtn} onClick={handleLinkCopied}><DoneAll /></IconButton>
                        :
                        <IconButton sx={classes.copyLinkBtn} onClick={handleLinkCopied}><Link /></IconButton>
                    }
                </Tooltip>
            </Box>
            <Grid container>
                {gridItemContainer(5, formatDate(subspaceData.dateCreated), "Date Created", "Date Created")}
                {gridItemContainer(2, " ", "")}
                {gridItemContainer(5, subspaceData.postsCount, "Post", "Posts")}
            </Grid>
            <Box sx={classes.gridItemBox}>
                {subspaceData?.creatorDetails?.isDeleted ?
                    <Typography sx={classes.gridItemValue}><span style={{ fontSize: "13px" }}>e/</span>[Deleted]</Typography>
                    :
                    <Typography sx={classes.gridItemValue} onClick={() => navigate(`/e/${subspaceData?.creatorDetails?.userName}`)}>
                        <span style={{ fontSize: "13px" }}>e/</span>{subspaceData?.creatorDetails?.userName}
                    </Typography>
                }
                <Typography sx={classes.gridItemTitle}>Creator</Typography>
            </Box>
            <Divider sx={{ marginTop: "4px" }} />
            <Typography sx={classes.subspaceDescription}>{subspaceData.description}</Typography>
            <Typography sx={{ fontSize: "12px" }}>Description</Typography>
            <Divider sx={{ margin: "8px 0" }} />
            <Box sx={classes.chipContainer}>
                {subspaceData?.topics.map(data => <Chip key={data.key} label={data.label} sx={{ bgcolor: "#0090c1", color: "white" }} />)}
            </Box>
        </Box>
    );
};

export default SubspaceProfileBar;