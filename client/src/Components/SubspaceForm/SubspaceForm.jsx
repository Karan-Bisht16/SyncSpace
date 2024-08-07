import React, { useState, useContext, useEffect, useRef } from "react";
import { Button, Box, Chip, Divider, Grid, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import imageCompression from "browser-image-compression";
// Importing my components
import RealTimeSubspaceViewer from "./RealTimeSubspaceViewer/RealTimeSubspaceViewer";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import preDefinedTopics from "../../assets/preDefinedTopics";
import InputField from "../InputField/InputField";
import FileUpload from "../FileUpload/FileUpload";
// Importing contexts
import { ReRenderContext, ConfirmationDialogContext, SnackBarContext } from "../../store";
// Importing actions
import { createSubspace, fetchSubspaceInfo, updateSubspace } from "../../actions/subspace";
// Importing styling
import styles from "./styles"

function SubspaceForm(props) {
    const { user, type, subspaceFormData } = props;
    const { subspaceName } = useParams();
    const { setReRender } = useContext(ReRenderContext);
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const { dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar } = useContext(ConfirmationDialogContext);
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const nameField = useRef(null);
    const descriptionField = useRef(null);

    const [subspaceData, setSubspaceData] = useState({
        name: "",
        description: "",
        creator: user._id,
        avatar: "",
        topics: [],
    });
    // JS for Stepper
    const steps = ["Add name", "Add styling", "Add topics"]
    const [activeStep, setActiveStep] = useState(0);
    function handleNext() {
        if (activeStep === 0) {
            if (handleFirstSubmit()) { setActiveStep(1) }
            else { return false }
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };
    function handleBack() {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    // JS for Chip
    const [topicsArray, setTopicsArray] = useState([]);
    function handleTopicDeletion(topicToDelete) {
        setTopicsArray(prevTopicsArray => prevTopicsArray.filter(topic => topic.key !== topicToDelete.key))
    };
    function handleTopicSelection(topicToSelect) {
        setTopicsArray(prevTopicsArray => {
            let flag = true;
            prevTopicsArray.forEach(topic => {
                if (topicToSelect.key === topic.key) { flag = false }
            });
            if (flag) { prevTopicsArray.push(topicToSelect) }
            return [...prevTopicsArray];
        });
    }
    function getFormattedChip(data) {
        if (!data.label) {
            return (<div key={data.key} style={classes.chipDivider}><Divider /></div>);
        } else {
            return (<Chip key={data.key} label={data.label} onClick={() => handleTopicSelection(data)} />);
        }
    }
    const [updateSubspaceId, setUpdateSubspaceId] = useState(null);
    useEffect(() => {
        async function getSubspaceInfo() {
            const { status, result } = await dispatch(fetchSubspaceInfo({ subspaceName }));
            if (status === 200) {
                setSubspaceData({
                    name: result.name,
                    description: result.description,
                    creator: user._id,
                    avatar: result.avatar,
                    topics: result.topics,
                });
                setUpdateSubspaceId(result._id);
                setTopicsArray(result.topics);
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        }
        if (type.toUpperCase() === "UPDATE") {
            if (subspaceFormData) {
                setSubspaceData({
                    name: subspaceFormData.name,
                    description: subspaceFormData.description,
                    creator: user._id,
                    avatar: subspaceFormData.avatar,
                    topics: subspaceFormData.topics,
                });
                setUpdateSubspaceId(subspaceFormData._id);
                setTopicsArray(subspaceFormData.topics);
            } else {
                getSubspaceInfo();
            }
        }
    }, [type, user._id, subspaceFormData, subspaceName, dispatch, setSnackbarValue, setSnackbarState]);
    // File Upload
    const fileUploadOptions = {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 360,
        useWebWorker: true,
    }
    function setFile(fileBase64String) {
        document.querySelector("#fileChosen").textContent = "1 file selected";
        setSubspaceData(prevSubspaceData => {
            return { ...prevSubspaceData, "avatar": fileBase64String };
        });
    }
    async function compressImage(imageFile) {
        const compressedBlob = await imageCompression(imageFile, fileUploadOptions);
        const compressedBase64String = await imageCompression.getDataUrlFromFile(compressedBlob);
        setFile(compressedBase64String);
    }
    function handleFileUpload(file) {
        let fileSize = Number(file.size.slice(0, file.size.length - 2));
        let fileType = file.type.includes("image");
        if (fileSize > process.env.REACT_APP_SUBSPACE_AVATAR_SIZE) {
            setSnackbarValue({
                message: `File size must be less than ${process.env.REACT_APP_SUBSPACE_AVATAR_SIZE / 1000}MB!`,
                status: "error"
            });
            setSnackbarState(true);
            resetSelectedFiles();
        } else if (!fileType) {
            setSnackbarValue({ message: "Select a valid image", status: "error" });
            setSnackbarState(true);
            resetSelectedFiles();
        } else if (fileSize > 50) {
            compressImage(file.file);
        } else {
            setFile(file.base64);
        }
    }
    function resetSelectedFiles() {
        const file = document.querySelector("input[type=file]");
        file.value = "";
        document.querySelector("#fileChosen").textContent = "No file selected";
        setSubspaceData(prevSubspaceData => {
            return { ...prevSubspaceData, "avatar": "" };
        });
    }
    function handleChange(event) {
        const { name, value } = event.target;
        setSubspaceData(prevPostData => {
            return { ...prevPostData, [name]: value };
        });
    }
    // Clear Form 
    function handleClear() {
        setActiveStep(0);
        setTopicsArray([]);
        setSubspaceData({
            name: "",
            description: "",
            creator: user._id,
            members: [user._id],
            moderators: [user._id],
            topics: [],
        });
    }
    // Submit Form
    function handleFirstSubmit() {
        if (subspaceData.name.trim() === "") {
            nameField.current.focus();
            return false;
        }
        if (subspaceData.description.trim() === "") {
            descriptionField.current.focus();
            return false;
        }
        setSubspaceData(prevSubspaceData => {
            return { ...prevSubspaceData, topics: topicsArray }
        })
        return true;
    }
    function handleSecondSubmit() {
        if (topicsArray.length < 5) {
            setSnackbarValue({ message: "Select atleast 5 topics", status: "error" });
            setSnackbarState(true);
            return false;
        }
        return true;
    }
    function handleSubmit(event) {
        event.preventDefault();
        if (!handleFirstSubmit()) {
            return false;
        }
        if (activeStep === 0) {
            setActiveStep(1);
            return false;
        }
        if (!handleSecondSubmit()) {
            setActiveStep(2);
            return false;
        }
        if (type.toUpperCase() === "CREATE") {
            openDialog({
                title: "Create Subspace",
                message:
                    <span>
                        Are you sure you want to create this new subspace?
                        As the creator, you will automatically become the moderator of this subspace.
                        <br /><br />
                        Proceed?
                    </span>,
                cancelBtnText: "Cancel", submitBtnText: "Create"
            });
        } else if (type.toUpperCase() === "UPDATE") {
            handleUpdateSubspace();
        }
    }
    async function handleUpdateSubspace() {
        const { status, result } = await dispatch(updateSubspace({ subspaceId: updateSubspaceId, subspaceData }));
        if (status === 200) {
            setReRender(prevReRender => !prevReRender);
            navigate("/", { state: { status: "success", message: "Subspace updated successfully!", time: new Date().getTime() } });
        } else {
            setSnackbarValue({ message: result.message, status: "error" });
            setSnackbarState(true);
        }
    }
    async function handleDialog() {
        setLinearProgressBar(true);
        try {
            const { status, result } = await dispatch(createSubspace(subspaceData));
            closeDialog();
            if (status === 200) {
                setReRender(prevReRender => !prevReRender);
                navigate("/", { state: { status: "success", message: `ss/${subspaceData.name.replace(/ /g, "-")} is now live!`, time: new Date().getTime() } });
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
            }
        } catch (error) {
            closeDialog();
            setSnackbarValue({ message: error.message, status: "error" });
            setSnackbarState(true);
        }
    }

    return (
        <div>
            <Grid container>
                <Grid item xs={12} lg={8.75}>
                    <Box>
                        {(activeStep === 0) &&
                            <Typography variant="h4" sx={{ marginBottom: { xs: "180px", lg: "24px" } }}>{type} Subspace</Typography>
                        } {(activeStep === 1) &&
                            <Typography variant="h4" sx={{ marginBottom: { xs: "190px", lg: "24px" } }}>{type} Subspace</Typography>
                        } {(activeStep === 2) &&
                            <Typography variant="h4" sx={{ marginBottom: { xs: "12px", sm: "281px", lg: "24px" } }}>{type} Subspace</Typography>
                        }
                        <form noValidate onSubmit={handleSubmit}>
                            {(activeStep === 0) &&
                                <>
                                    <InputField
                                        name="name" label="Name" value={subspaceData.name} type="text"
                                        handleChange={handleChange} reference={nameField} autoFocus={true}
                                    />
                                    <InputField
                                        name="description" label="Description" value={subspaceData.description} type="text"
                                        handleChange={handleChange} reference={descriptionField} multiline={true} rows={4}
                                        sx={{ height: "131px" }}
                                    />
                                    <hr />
                                </>
                            } {(activeStep === 1) &&
                                <>
                                    <FileUpload handleFileUpload={handleFileUpload} resetSelectedFiles={resetSelectedFiles} />
                                    <hr />
                                </>
                            } {(activeStep === 2) &&
                                <Box sx={classes.topicsContainer}>
                                    <Box sx={classes.selectedChipContainer}>
                                        <Box>
                                            {!topicsArray.length ?
                                                <p>Choose atleast 5 topics from the following: </p> :
                                                <div style={classes.selectedChipContainerArray}>
                                                    {topicsArray.map(data => {
                                                        return (
                                                            <Chip
                                                                key={data.key}
                                                                label={data.label}
                                                                color="primary"
                                                                onDelete={() => handleTopicDeletion(data)}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            }
                                        </Box>
                                    </Box>
                                    <hr />
                                    <Box sx={classes.chipContainer}>
                                        {preDefinedTopics.map(data => { return (getFormattedChip(data)) })}
                                    </Box>
                                    <hr />
                                    <Box sx={{ marginTop: "15px" }}>
                                        <Box sx={{ float: "left" }}>
                                            <Button variant="outlined" size="large" sx={classes.resetBtn} onClick={handleBack}>Back</Button>
                                        </Box>
                                        <Box sx={{ float: "right", top: "150px" }}>
                                            <Button variant="outlined" size="large" sx={classes.resetBtn} onClick={handleClear}>Reset</Button>
                                            <Button variant="contained" color="primary" size="large" type="submit" sx={classes.createBtn}>{type}</Button>
                                        </Box>
                                    </Box>
                                </Box>
                            } {(activeStep === 1) &&
                                <Box sx={{ float: "left" }}>
                                    <Button variant="outlined" size="large" sx={classes.resetBtn} onClick={handleBack}>Back</Button>
                                </Box>
                            } {(activeStep === 0 || activeStep === 1) &&
                                <Box sx={{ float: "right" }}>
                                    <Button variant="contained" color="primary" size="large" sx={classes.createBtn} onClick={handleNext}>Next</Button>
                                </Box>
                            }
                        </form>
                    </Box>
                </Grid>
                <Grid item lg={0.25}></Grid>
                <RealTimeSubspaceViewer subspaceData={subspaceData} activeStep={activeStep} />
            </Grid>

            <Box sx={classes.stepperContainer}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => {
                        return (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
            </Box>
            <ConfirmationDialog dialog={dialog} closeDialog={closeDialog} handleDialog={handleDialog} linearProgressBar={linearProgressBar} dialogValue={dialogValue} />
        </div>
    );
}

export default SubspaceForm;