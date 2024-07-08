import React from "react";
import { Container } from "@mui/material";
// Importing styling
import styles from "./styles";

function Post(props) {
    const classes = styles();

    return (
        <Container maxWidth="lg">
            <h1>Post</h1>
        </Container>
    );
}

export default Post;