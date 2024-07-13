import React, { useState, useEffect } from "react";
import { Avatar, Box, Checkbox, Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { FiberManualRecordTwoTone, CommentOutlined, Favorite, FavoriteBorderOutlined, Link, DoneAll } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser";
// Importing my components
import { formatTime } from "../../../utils/functions";
// Importing styling
import styles from "./styles";

import Carousel from "react-bootstrap/Carousel";

function Post(props) {
    const { post, setSnackbarValue, setSnackbarState } = props;
    const { subspaceName, authorName, dateCreated, title, body, selectedFile, likes, commentsCount } = post;
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
    function handleUserProfileClick() {
        navigate("/e/" + authorName);
    }
    const [index, setIndex] = useState(0);
    function handleSelect(selectedIndex) {
        setIndex(selectedIndex);
    };
    const [linkCopied, setLinkCopied] = useState(false);
    function handleLinkCopied() {
        navigator.clipboard.writeText(process.env.REACT_APP_DOMAIN + "/post/" + post._id)
        setLinkCopied(true);
        setSnackbarState(true);
        setSnackbarValue({ message: "Link copied to clipboard", status: "info" });
    }
    function bodyText() {
        const options = {
            replace(domNode) {
                if (domNode.name === "img") {
                    return <img
                        src={domNode.attribs.src} alt="post related img init"
                        style={{ height: "100%", width: "100%", verticalAlign: "middle" }}
                    />;
                }
            }
        };
        return (
            parse(body, options)
        );
    }

    return (
        <Grid item sx={classes.mainContainer}>
            <Box>
                <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <Box sx={{ bgcolor: "background.primary", padding: "2.5px", borderRadius: "50%", }}>
                        <Avatar sx={{ width: "32.5px", height: "32.5px" }} src={subspaceAvatar} alt="Subspace avatar">{subspaceName.charAt(0)}</Avatar>
                    </Box>
                    <Box sx={{ display: "flex", gap: "2px", alignItems: "center" }}>
                        <Typography sx={{ fontSize: "18px", cursor: "pointer", marginRight: "8px" }} onClick={handleSubspaceClick}>
                            <span style={{ fontSize: "12px" }}>ss/</span>{subspaceName}
                        </Typography>
                        <FiberManualRecordTwoTone sx={{ fontSize: "8px" }} />
                        <Typography sx={{ fontSize: "12px" }}>{formatTime(dateCreated)} ago</Typography>
                    </Box>
                </Box>
                <Typography variant="h6">{title}</Typography>
            </Box>
            {body ?
                <Box sx={{ bgcolor: "background.tertiary", borderRadius: "16px", padding: "8px 16px", margin: "4px 0 8px 0", boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px", }}>
                    <Typography component={"div"}>{bodyText()}</Typography>
                    <Typography sx={{ fontSize: "18px", textAlign: "right", cursor: "pointer" }} onClick={handleUserProfileClick}>e/{authorName}</Typography>
                </Box>
                :
                <>
                    <Box sx={{ display: "flex", justifyContent: "center", height: { xs: "auto", md: "625px" }, objectFit: "scale-down" }} >
                        {selectedFile.length > 1 ?
                            <Carousel slide={false} activeIndex={index} onSelect={handleSelect} style={{ display: "flex", justifyContent: "center", lineHeight: "300px", margin: "8px 0", borderRadius: "16px", objectFit: "scale-down", overflow: "hidden" }}>
                                {selectedFile.map((file, index) =>
                                    file.type.includes("image") ?
                                        <Carousel.Item key={index} style={{ objectFit: "scale-down" }}>
                                            <img
                                                src={file.file} alt="post related img init"
                                                style={{ height: "100%", width: "100%", verticalAlign: "middle" }}
                                            />
                                        </Carousel.Item>
                                        :
                                        <></>
                                )}
                            </Carousel>
                            :
                            <Box sx={{ display: "flex", justifyContent: "center", lineHeight: "600px", margin: "8px 0", borderRadius: "16px", objectFit: "scale-down", overflow: "hidden" }}>
                                <img style={{ height: "100%", width: "100%", borderRadius: "16px", verticalAlign: "middle" }} src={selectedFile[0].file} alt="post related" />
                            </Box>
                        }
                    </Box>
                    <Typography sx={{ fontSize: "18px", textAlign: "right", cursor: "pointer" }} onClick={handleUserProfileClick}>e/{authorName}</Typography>
                </>
            }

            <Paper elevation={2} sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: { xs: "auto", md: "250px" }, bgcolor: "background.default", borderRadius: "32px", marginTop: "8px" }}>
                <Box>
                    <Checkbox icon={<FavoriteBorderOutlined />} checkedIcon={<Favorite sx={{ color: "#0090c1" }} />} />
                    <span style={{ fontSize: "16px" }}>{likes}</span>
                </Box>
                <Box>
                    <IconButton>
                        <CommentOutlined sx={{ cursor: "pointer" }} />
                    </IconButton>
                    <span style={{ fontSize: "16px" }}>{commentsCount}</span>
                </Box>
                <Tooltip title={linkCopied ? "Profile link copied" : "Copy profile link"}>
                    {linkCopied ?
                        <IconButton onClick={handleLinkCopied}>
                            <DoneAll />
                        </IconButton>
                        :
                        <IconButton onClick={handleLinkCopied}>
                            <Link />
                        </IconButton>
                    }
                </Tooltip>
            </Paper>
        </Grid >
    );
}

export default Post;