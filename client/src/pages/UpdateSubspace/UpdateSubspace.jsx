import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
// Importing my components
import SubspaceForm from "../../Components/SubspaceForm/SubspaceForm";
import NotFound from "../../Components/NotFound/NotFound";
// Importing styling
import styles from "./styles";

function UpdateSubspace(props) {
    const { user } = props;
    const { subspaceName } = useParams();
    const classes = styles();
    const location = useLocation();

    useEffect(() => {
        document.title = `SyncSpace: Update ss/${subspaceName}`;
    }, [subspaceName]);

    const [validation, setValidation] = useState(false);
    const [subspaceFormData, setSubspaceFormData] = useState(null);
    useEffect(() => {
        if (location && location.state) {
            const { subspaceData } = location.state;
            if (subspaceData) {
                if (subspaceData.creator === user._id) { setValidation(true) }
                setSubspaceFormData(subspaceData);
            }
        }
    }, [location, user._id]);

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                {validation ?
                    <SubspaceForm user={user} type="Update" subspaceFormData={subspaceFormData} />
                    :
                    <NotFound
                        mainText="Unauthorised access"
                        link={{ linkText: "Go home", to: "/", state: {} }}
                    />
                }
                <Box sx={classes.postContainer} />
            </Box>
        </Grid>
    );
}

export default UpdateSubspace;