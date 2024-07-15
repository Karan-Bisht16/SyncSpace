import React, { useState, useEffect } from "react";
import { Avatar, Box, Checkbox, Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { FiberManualRecordTwoTone, CommentOutlined, Favorite, FavoriteBorderOutlined, Link, DoneAll, CloseRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Carousel from "react-bootstrap/Carousel";
import parse from "html-react-parser";
// Importing my components
import { formatTime } from "../../../utils/functions";
// Importing actions
import { fetchSubspaceAvatar } from "../../../actions/subspace";
// Importing styling
import styles from "./styles";

function Post(props) {
    const { post, individual, redirect, setSnackbarValue, setSnackbarState } = props;
    const { subspaceName, authorName, dateCreated, title, body, selectedFile, likes, commentsCount } = post;
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.user);
    const [subspaceAvatar, setSubspaceAvatar] = useState(null);
    useEffect(() => {
        async function getSubspaceAvatar() {
            const { status, result } = await dispatch(fetchSubspaceAvatar({ subspaceName }));
            if (status === 200) {
                setSubspaceAvatar(result.subspaceAvatar);
            }
        }
        if (user) {
            const desiredSubspace = user.subspacesJoined.filter(subspace => subspace.name.replace(/ /g, "-") === subspaceName)[0];
            if (desiredSubspace) {
                setSubspaceAvatar(desiredSubspace.avatar);
            } else {
                getSubspaceAvatar();
            }
        } else {
            getSubspaceAvatar();
        }
    }, [user, subspaceName, dispatch]);
    function handleSubspaceClick() {
        navigate("/ss/" + subspaceName);
    }
    function handleUserProfileClick() {
        navigate("/e/" + authorName);
    }
    function handlePostClick() {
        navigate("/post/" + post._id, { state: { post } });
    }
    function handleClose() {
        if (redirect) {
            navigate("/");
        } else {
            navigate(-1);
        }
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
        <Grid item sx={Object.assign({ bgcolor: !individual && "background.backdrop" }, classes.mainContainer)}>
            <Box>
                <Box sx={classes.subContainer}>
                    <Box sx={classes.postHeader}>
                        <Box sx={classes.avatarContainer}>
                            <Avatar sx={classes.avatar} src={subspaceAvatar} alt="Subspace avatar">
                                {subspaceName.charAt(0)}
                            </Avatar>
                        </Box>
                        <Box sx={classes.postHeaderDetails}>
                            <Typography sx={classes.postSubspace} onClick={handleSubspaceClick}>
                                <span style={classes.headerText}>ss/</span>{subspaceName}
                            </Typography>
                            <FiberManualRecordTwoTone sx={{ fontSize: "8px" }} />
                            <Typography sx={classes.headerText}>{formatTime(dateCreated)} ago</Typography>
                        </Box>
                    </Box>
                    {individual &&
                        <IconButton sx={classes.closeBtn} onClick={handleClose}><CloseRounded /></IconButton>
                    }
                </Box>
                <Typography sx={classes.link} onClick={handlePostClick} variant="h6">{title}</Typography>
            </Box>
            {body ?
                <Box sx={classes.bodyContainer}>
                    <Typography sx={classes.bodyText} component={"div"}>{bodyText()}</Typography>
                    <Typography sx={classes.author} onClick={handleUserProfileClick}>e/{authorName}</Typography>
                </Box>
                :
                <>
                    <Box sx={classes.fileContainer} >
                        {selectedFile.length > 1 ?
                            <Carousel slide={false} activeIndex={index} onSelect={handleSelect} style={classes.imageContainer}>
                                {selectedFile.map((file, index) =>
                                    file.type.includes("image") &&
                                    <Carousel.Item key={index} style={{ objectFit: "scale-down" }}>
                                        <img
                                            src={file.file} alt="post related img init"
                                            style={classes.imageBox}
                                        />
                                    </Carousel.Item>
                                )}
                            </Carousel>
                            :
                            <Box sx={classes.imageContainer}>
                                <img style={classes.imageBox} src={selectedFile[0].file} alt="post related" />
                            </Box>
                        }
                    </Box>
                    <Typography sx={classes.author} onClick={handleUserProfileClick}>e/{authorName}</Typography>
                </>
            }

            <Paper elevation={2} sx={classes.postActionsContainer}>
                <Box>
                    <Checkbox icon={<FavoriteBorderOutlined sx={classes.iconColor} />} checkedIcon={<Favorite sx={{ color: "#0090c1" }} />} />
                    <span style={classes.iconText}>{likes}</span>
                </Box>
                {individual ?
                    <Box>
                        <IconButton>
                            <CommentOutlined sx={classes.iconColor} />
                        </IconButton>
                        <span style={classes.iconText}>{commentsCount}</span>
                    </Box>
                    :
                    <Box sx={classes.link} onClick={handlePostClick} >
                        <IconButton>
                            <CommentOutlined sx={classes.iconColor} />
                        </IconButton>
                        <span style={classes.iconText}>{commentsCount}</span>
                    </Box>
                }
                <Tooltip title={linkCopied ? "Profile link copied" : "Copy profile link"}>
                    {linkCopied ?
                        <IconButton onClick={handleLinkCopied}>
                            <DoneAll sx={classes.iconColor} />
                        </IconButton>
                        :
                        <IconButton onClick={handleLinkCopied}>
                            <Link sx={classes.iconColor} />
                        </IconButton>
                    }
                </Tooltip>
            </Paper>
        </Grid >
    );
}

export default Post;