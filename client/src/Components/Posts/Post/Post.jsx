import React, { useState, useEffect, useContext } from "react";
import { Avatar, Box, Grid, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { FiberManualRecordTwoTone, CloseRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Carousel from "react-bootstrap/Carousel";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import parse from "html-react-parser";
// Importing my components
import { formatDate, formatTime } from "../../../utils/functions";
import BodyFooter from "./BodyFooter/BodyFooter";
// Importing contexts
import { SnackBarContext } from "../../../store/index";
// Importing actions
import { isPostLiked, likePost } from "../../../actions/post";
// Importing styling
import styles from "./styles";
import PostOperations from "./PostOperations/PostOperations";

function Post(props) {
    const { post, isPostLikedByUser, individual, redirect } = props;
    const { _id, authorDetails, subspaceDetails, dateCreated, title, body, selectedFile, likesCount, edited } = post;
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector(state => state.user);
    const [postLiked, setPostLiked] = useState(false);
    useEffect(() => {
        async function checkIfPostIsLiked() {
            const { status, result } = await dispatch(isPostLiked({ postId: _id, userId: user._id }));
            if (status === 200) { setPostLiked(result) }
        }
        if (user) {
            if (isPostLikedByUser) {
                setPostLiked(true);
            } else {
                checkIfPostIsLiked()
            }
        }
        setPostLikesCount(likesCount);
    }, [_id, user, isPostLikedByUser, likesCount, dispatch]);
    function handleSubspaceClick(subspaceName) {
        navigate("/ss/" + subspaceName);
    }
    function handleUserProfileClick(userName) {
        navigate("/e/" + userName);
    }
    function handlePostClick() {
        if (!individual) {
            navigate("/post/" + _id, { state: { postData: { post }, isPostLikedByUser: postLiked } });
        }
    }
    function handlePostClose() {
        if (redirect) { navigate("/") }
        else { navigate(-1) }
    }
    const [index, setIndex] = useState(0);
    function handleSelect(selectedIndex) {
        setIndex(selectedIndex);
    };
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
    const [postLikesCount, setPostLikesCount] = useState(likesCount);
    async function handleLike() {
        if (user) {
            const tempPostLiked = postLiked;
            setPostLiked(!postLiked);
            if (tempPostLiked) {
                setPostLikesCount(postLikesCount - 1);
            } else {
                setPostLikesCount(postLikesCount + 1);
            }
            const { status, result } = await dispatch(likePost({ postId: post._id, userId: user._id, action: !tempPostLiked }));
            if (status !== 200) {
                setPostLiked(tempPostLiked);
                if (tempPostLiked) {
                    setPostLikesCount(postLikesCount + 1);
                } else {
                    setPostLikesCount(postLikesCount - 1);
                }
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        } else {
            navigate("/authentication");
        }
    }
    return (
        <Grid item sx={classes.mainContainer}>
            <Box>
                <Box sx={classes.subContainer}>
                    <Box sx={classes.postHeader}>
                        <Box sx={classes.avatarContainer}>
                            <Avatar sx={classes.avatar} alt="Subspace avatar" src={subspaceDetails?.avatarURL}>
                                {subspaceDetails?.subspaceName?.charAt(0)}
                            </Avatar>
                        </Box>
                        <Box sx={classes.postHeaderDetails}>
                            {subspaceDetails?.isDeleted ?
                                <Typography sx={classes.postSubspace}><span style={classes.headerText}>ss/</span>[Deleted]</Typography>
                                :
                                <Typography sx={classes.postSubspace} onClick={() => handleSubspaceClick(subspaceDetails?.subspaceName)}>
                                    <span style={classes.headerText}>ss/</span>{subspaceDetails?.subspaceName}
                                </Typography>
                            }
                            <FiberManualRecordTwoTone sx={{ fontSize: "8px" }} />
                            <Tooltip title={formatDate(dateCreated)}>
                                <Typography sx={classes.headerText}>{formatTime(dateCreated)} ago</Typography>
                            </Tooltip>
                        </Box>
                    </Box>
                    {individual &&
                        <IconButton sx={classes.closeBtn} onClick={handlePostClose}><CloseRounded /></IconButton>
                    }
                </Box>
                <Typography sx={{ ...classes.link, fontSize: { xs: "16px", sm: "18px" } }} onClick={handlePostClick}>{title}</Typography>
            </Box>
            {body ?
                <>
                    <Paper sx={classes.bodyContainer}>
                        <Typography sx={classes.bodyText} component={"div"}>{bodyText()}</Typography>
                    </Paper>
                    <BodyFooter classes={classes} authorDetails={authorDetails} edited={edited} handleUserProfileClick={handleUserProfileClick} />
                </>
                :
                <>
                    {selectedFile && selectedFile?.length > 1 ?
                        <Box sx={classes.fileContainer}>
                            <Carousel slide={false} interval={null} activeIndex={index} onSelect={handleSelect} style={classes.imageContainer}>
                                {selectedFile.map((file, index) =>
                                    file.mediaType.includes("image") ?
                                        <Carousel.Item key={index} style={classes.carouselImageItem}>
                                            <img src={file.mediaURL} alt={title} style={classes.multipleImageBox} />
                                        </Carousel.Item>
                                        :
                                        <Carousel.Item key={index} style={classes.carouselMiscItem}>
                                            <Box sx={{ textAlign: "center" }}>Multiple files of {file.mediaType} are not implemented.</Box>
                                        </Carousel.Item>
                                )}
                            </Carousel>
                        </Box>
                        :
                        <Box>
                            {selectedFile[0].mediaType.includes("image") &&
                                <Box sx={classes.imageContainer}>
                                    <img style={classes.imageBox} src={selectedFile[0].mediaURL} alt="post related" />
                                </Box>
                            } {selectedFile[0].mediaType.includes("video") &&
                                <Box sx={classes.imageContainer}>
                                    <video controls style={classes.videoBox}>
                                        {/* mediaType might cause problem */}
                                        <source type={selectedFile[0].mediaType} src={selectedFile[0].mediaURL} />
                                    </video>
                                </Box>
                            }{selectedFile[0].mediaType.includes("audio") &&
                                <Box sx={classes.audioContainer}>
                                    <AudioPlayer autoPlay={false} src={selectedFile[0].mediaURL} style={classes.audioBox} />
                                </Box>
                            }
                        </Box>
                    }
                    <BodyFooter classes={classes} authorDetails={authorDetails} edited={edited} handleUserProfileClick={handleUserProfileClick} />
                </>
            }
            <PostOperations
                classes={classes} user={user} post={post} individual={individual}
                postLiked={postLiked} postLikesCount={postLikesCount} handleLike={handleLike} handlePostClick={handlePostClick}
            />
        </Grid >
    );
}

export default Post;