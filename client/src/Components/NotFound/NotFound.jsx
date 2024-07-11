import React from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
// Importing styling
import styles from "./styles";
// Importing images
import NotFoundImage from "../../assets/img-not-found.png";

function NotFound(props) {
    const { img, mainText, link } = props;
    let linkText, to, state
    if (link) {
        linkText = link.linkText;
        to = link.to;
        state = link.state;
    }
    const classes = styles();
    const navigate = useNavigate();

    function handleClick() {
        navigate(to, { state: state });
    }

    return (
        <div style={classes.mainContainer}>
            {img && <img style={classes.image} src={NotFoundImage} alt="Page not found"></img>}
            {mainText && <Typography sx={classes.title}>{mainText}</Typography>}
            {link && <Typography sx={classes.link} onClick={handleClick}>{linkText}</Typography>}
        </div>
    );
}

export default NotFound;