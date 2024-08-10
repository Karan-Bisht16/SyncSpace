import React from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
// Importing styling
import styles from "./styles";

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
            {
                img &&
                <lord-icon
                    src="https://cdn.lordicon.com/usownftb.json" trigger="loop" delay="1000" state="hover-oscillate"
                    colors="primary:#0090c1,secondary:#0090c1" style={{ width: "250px", height: "250px" }}
                />
            }
            {mainText && <Typography sx={classes.title}>{mainText}</Typography>}
            {link && <Typography sx={classes.link} onClick={handleClick}>{linkText}</Typography>}
        </div>
    );
}

export default NotFound;