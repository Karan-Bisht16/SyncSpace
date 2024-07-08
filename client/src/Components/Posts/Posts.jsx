import React from "react";
import { Typography, Grid, Box } from "@mui/material";
import { ping } from 'ldrs';
// Importing my components
import Post from "./Post/Post";
// Importing styling
import styles from "./styles";
import SyncSpaceLogo from "../../images/img-syncspace-logo.avif";

function Posts(props) {
    const classes = styles();
    const { posts } = props;
    console.log(posts);

    ping.register('l-ping');

    return (
        <div>
            <Typography variant="h4" color="inherit">All Posts</Typography>
            {!posts.length ?
                <Box sx={{ display: "flex", justifyContent: "center", margin: "25px" }}>
                    <img src={SyncSpaceLogo} style={{ marginTop: "30px", width: "65px", height: "65px", borderRadius: "50%", position: "absolute", zIndex: "100" }}></img>
                    <l-ping
                        size="125"
                        speed="2"
                        color="#0090c1"
                    ></l-ping>
                </Box>
                :
                <Grid container alignItems="stretch" spacing="5px">
                    {posts.map((post) => (
                        <Grid key={post._id} item xs={12} sm={12}>
                            <Post post={post}></Post>
                        </Grid>
                    ))}
                </Grid>
            }
        </div>
    );
}

export default Posts;