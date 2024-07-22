import React from "react";
import { Box } from "@mui/material";

function BodyFooter(props) {
    const { classes, authorDetails, edited, handleUserProfileClick } = props;

    return (
        <Box sx={classes.bodyFooter}>
            <Box>
                {edited ? <span style={{ fontSize: "10px" }}>[Edited]</span> : <span></span>}
            </Box>
            <Box>
                {authorDetails.isDeleted ?
                    <span style={classes.author}><span style={{ fontSize: "13px" }}>e/</span>[Deleted]</span>
                    :
                    <span style={classes.author} onClick={() => handleUserProfileClick(authorDetails.userName)}>
                        <span style={{ fontSize: "13px" }}>e/</span>{authorDetails.userName}
                    </span>
                }
            </Box>
        </Box>
    );
};

export default BodyFooter;