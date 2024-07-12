import React, { useState, useEffect } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from 'html-react-parser';
// Importing styling
import styles from "./styles";

function Post(props) {
    const { post } = props;
    const { subspaceName, authorName, dateCreated, title, body, selectedFile } = post;
    const classes = styles();
    const navigate = useNavigate();

    const user = useSelector(state => state.user);
    const [subspaceAvatar, setSubspaceAvatar] = useState(null);
    useEffect(() => {
        if (user) {
            const desiredSubspace = user.subspacesJoined.filter(subspace => subspace.name.replace(/ /g, "-") === subspaceName)[0];
            if (desiredSubspace) {
                setSubspaceAvatar(desiredSubspace.avatar);
            } else {
                // getSubspaceAvatar()
            }
        } else {
            // getSubspaceAvatar()
        }
    }, [user, subspaceName]);
    function handleSubspaceClick() {
        navigate("/ss/" + subspaceName);
    }

    return (
        <Box sx={classes.mainContainer}>
            <Box sx={{ display: "flex", gap: "16px" }}>
                <Avatar src={subspaceAvatar} alt="Subspace avatar">{subspaceName.charAt(0)}</Avatar>
                <Box>
                    <Typography variant="h6" onClick={handleSubspaceClick}>ss/{subspaceName}</Typography>
                    <Typography variant="h6">e/{authorName}</Typography>
                    <Typography variant="h6">{title}</Typography>
                </Box>
            </Box>
            {body ?
                <Box>
                    <Typography component={"div"}>{parse(body)}</Typography>
                </Box>
                :
                <></>
            }
        </Box>
    );
}

export default Post;