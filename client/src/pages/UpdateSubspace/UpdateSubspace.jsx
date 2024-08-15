import React, { useState, useEffect, useContext } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { lineSpinner } from "ldrs";
// Importing my components
import SubspaceForm from "../../Components/SubspaceForm/SubspaceForm";
import NotFound from "../../Components/NotFound/NotFound";
// Importing contexts
import { SnackBarContext } from "../../contexts/SnackBar.context";
// Importing actions
import { fetchSubspaceInfo } from "../../actions/subspace";
// Importing styling
import styles from "./styles";

function UpdateSubspace(props) {
    const { user } = props;
    const { subspaceName } = useParams();
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const classes = styles();
    const dispatch = useDispatch();
    const location = useLocation();
    lineSpinner.register("l-loader");

    useEffect(() => {
        document.title = `SyncSpace: Update ss/${subspaceName}`;
    }, [subspaceName]);

    const [subspaceFormData, setSubspaceFormData] = useState({
        name: "",
        description: "",
        topics: [],
    });
    const [avatar, setAvatar] = useState(null);
    const [validation, setValidation] = useState(false);
    const [subspaceId, setSubspaceId] = useState(null);
    const [allSubspaceFormDataSet, setAllSubspaceFormDataSet] = useState(false);
    useEffect(() => {
        async function getSubspaceInfo() {
            const { status, result } = await dispatch(fetchSubspaceInfo({ subspaceName }));
            if (status === 200) {
                if (result.creator === user._id) { setValidation(true) }
                setSubspaceId(result._id);
                setSubspaceFormData({
                    name: result.name,
                    description: result.description,
                    topics: result.topics,
                });
                setAvatar(result.avatarURL);
                setAllSubspaceFormDataSet(true);
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        }
        if (location?.state && location.state.subspaceData) {
            const { subspaceData } = location.state;
            if (subspaceData.creator === user._id) { setValidation(true) }
            setSubspaceId(subspaceData._id);
            setSubspaceFormData({
                name: subspaceData.name,
                description: subspaceData.description,
                topics: subspaceData.topics,
            });
            setAvatar(subspaceData.avatarURL);
            setAllSubspaceFormDataSet(true);
        } else {
            getSubspaceInfo();
        }
    }, [location, subspaceName, user._id, dispatch, setSnackbarValue, setSnackbarState]);

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                {allSubspaceFormDataSet ?
                    <>
                        {validation ?
                            <SubspaceForm
                                subspaceData={subspaceFormData} setSubspaceData={setSubspaceFormData} avatar={avatar} setAvatar={setAvatar}
                                type="Update" subspaceId={subspaceId}
                            />
                            :
                            <>
                                <Typography variant="h4">Update Subspace</Typography>
                                <NotFound
                                    mainText="Unauthorised access"
                                    link={{ linkText: "Go home", to: "/", state: {} }}
                                />
                            </>
                        }
                    </>
                    :
                    <>
                        <Typography variant="h4">Update Subspace</Typography>
                        <Box sx={classes.loadingContainer}>
                            <l-loader size="75" speed="1.75" color="#0090c1" />
                        </Box>
                    </>
                }
            </Box>
        </Grid>
    );
}

export default UpdateSubspace;