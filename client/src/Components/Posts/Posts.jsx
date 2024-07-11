import React from "react";
import { Box } from "@mui/material";
import { lineSpinner } from "ldrs";
// Importing my components
import Post from "./Post/Post";
// Importing styling
import styles from "./styles";

function Posts(props) {
    const classes = styles();
    const { posts } = props;

    lineSpinner.register("l-loader");

    return (
        <>
            {!posts.length ?
                <Box sx={classes.mainContainer}>
                    <l-loader size="75" speed="1.75" color="#0090c1" />
                </Box>
                :
                <>
                    {posts.map((post, index) => (
                        <Post key={index} post={post}></Post>
                    ))}
                </>
            }
        </>
    );
}

export default Posts;