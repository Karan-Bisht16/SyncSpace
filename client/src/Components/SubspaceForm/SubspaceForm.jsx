import React, { useState, useRef } from "react";
import { Button, Box, Chip, Divider, Grid, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import imageCompression from "browser-image-compression";
// Importing my components
import RealTimeSubspaceViewer from "./RealTimeSubspaceViewer/RealTimeSubspaceViewer";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import preDefinedTopics from "../../assets/preDefinedTopics";
import InputField from "../InputField/InputField";
import FileUpload from "../FileUpload/FileUpload";
// Importing actions
import { createSubspace } from "../../actions/subspace";
// Importing styling
import styles from "./styles"

function SubspaceForm(props) {
    const { user, snackbar, confirmationDialog } = props;
    const [setSnackbarValue, setSnackbarState] = snackbar;
    const [dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar] = confirmationDialog;
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const nameField = useRef(null);
    const descriptionField = useRef(null);
    const creator = {
        userId: user._id,
        name: user.name,
        userName: user.userName
    };
    const [subspaceData, setSubspaceData] = useState({
        name: "",
        description: "",
        creator: creator,
        avatar: "",
        members: [creator.userId],
        moderators: [creator],
        topics: [],
    });
    // JS for Stepper
    const steps = ["Add name", "Add styling", "Add topics"]
    const [activeStep, setActiveStep] = useState(0);
    function handleNext() {
        if (activeStep === 0) {
            if (handleFirstSubmit()) {
                setActiveStep(1);
            } else {
                return false;
                // setActiveStep(0);
            }
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
                if (topicToSelect.key === topic.key) {
                    flag = false;
                }
            });
            if (flag) {
                prevTopicsArray.push(topicToSelect);
            }
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
            setSnackbarValue({ message: `File size must be less than ${process.env.REACT_APP_SUBSPACE_AVATAR_SIZE / 1000}MB!`, status: "error" });
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
        console.log(subspaceData);
        openDialog({ title: "Create Subspace", message: "Create a new subspace?", cancelBtnText: "Cancel", submitBtnText: "Create" });
    }
    async function handleDialog() {
        setLinearProgressBar(true);
        try {
            const { status, result } = await dispatch(createSubspace(subspaceData));
            closeDialog();
            if (status === 200) {
                navigate("/", { state: { status: "success", message: "Subspace created successfully!", time: new Date().getTime() } });
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
                        {(activeStep === 0 || activeStep === 1) &&
                            <Typography variant="h4" sx={{ marginBottom: { xs: "241px", lg: "24px" } }}>Create Subspace</Typography>
                        }
                        {(activeStep === 2) &&
                            <Typography variant="h4" sx={{ marginBottom: { xs: "24px", sm: "241px", lg: "24px" } }}>Create Subspace</Typography>
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
                                                <p>Choose atleast 5 topics from below</p> :
                                                <div style={{ padding: "12px 0", display: "flex", flexWrap: "wrap", gap: "5px" }}>
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
                                            <Button variant="contained" color="primary" size="large" type="submit" sx={classes.createBtn}>Create</Button>
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