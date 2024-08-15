import React, { useState, useContext, useRef, useEffect } from "react";
import { Button, Box, Chip, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, Grid, LinearProgress, Stepper, Step, StepLabel, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import imageCompression from "browser-image-compression";
// Importing my components
import RealTimeSubspaceViewer from "./RealTimeSubspaceViewer/RealTimeSubspaceViewer";
import preDefinedTopics from "../../assets/preDefinedTopics";
import InputField from "../InputField/InputField";
import FileUpload from "../FileUpload/FileUpload";
// Importing contexts
import { ReRenderContext } from "../../contexts/ReRender.context";
import { SnackBarContext } from "../../contexts/SnackBar.context";
import { ConfirmationDialogContext } from "../../contexts/ConfirmationDialog.context";
// Importing actions
import { updateSubspace, uploadSubspaceAvatar } from "../../actions/subspace";
// Importing styling
import styles from "./styles"

function SubspaceForm(props) {
    const { subspaceData, setSubspaceData, avatar, setAvatar, type, subspaceId } = props;
    const { setReRender } = useContext(ReRenderContext);
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const { openDialog, linearProgressBar, setLinearProgressBar } = useContext(ConfirmationDialogContext);
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const nameField = useRef(null);
    const descriptionField = useRef(null);

    // JS for Modal
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("Updating Subspace")
    function openModal() {
        setModal(true);
    }
    function closeModal() {
        setModal(false);
    }
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
    const [topicsArray, setTopicsArray] = useState(subspaceData.topics);
    useEffect(() => {
        if (type.toUpperCase() === "UPDATE" && avatar && activeStep === 1) {
            document.querySelector("#fileChosen").textContent = "1 file selected";
        }
    }, [type, avatar, activeStep]);
    function handleTopicDeletion(topicToDelete) {
        setTopicsArray(prevTopicsArray => prevTopicsArray.filter(topic => topic.key !== topicToDelete.key));
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
    // File Upload
    const fileUploadOptions = {
        maxSizeMB: 0.05,
        maxWidthOrHeight: 360,
        useWebWorker: true,
    }
    function setFile(file) {
        document.querySelector("#fileChosen").textContent = "1 file selected";
        setAvatar(file);
    }
    async function compressImage(imageFile) {
        const compressedBlob = await imageCompression(imageFile, fileUploadOptions);
        const compressedBase64String = await imageCompression.getDataUrlFromFile(compressedBlob);
        const fileObj = {
            base64: compressedBase64String,
            file: compressedBlob,
            name: compressedBlob.name,
            size: compressedBlob.size,
            type: compressedBlob.type,
        };
        setFile(fileObj);
    }
    function handleFileUpload(file) {
        let fileSize = Number(file.size.slice(0, file.size.length - 2));
        let fileType = file.type.includes("image");
        if (!fileType) {
            setSnackbarValue({ message: "Select a valid image", status: "error" });
            setSnackbarState(true);
            resetSelectedFiles();
        } else if (fileSize > process.env.REACT_APP_SUBSPACE_AVATAR_SIZE) {
            setSnackbarValue({
                message: `File size must be less than ${process.env.REACT_APP_SUBSPACE_AVATAR_SIZE / 1000}MB!`,
                status: "error"
            });
            setSnackbarState(true);
            resetSelectedFiles();
        } else if (fileSize > 50) {
            compressImage(file.file);
        } else {
            setFile(file);
        }
    }
    function resetSelectedFiles() {
        const file = document.querySelector("input[type=file]");
        file.value = "";
        document.querySelector("#fileChosen").textContent = "No file selected";
        setAvatar(null);
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
        setSubspaceData((prevSubspaceData) => {
            return {
                ...prevSubspaceData,
                "name": "",
                "description": "",
                "topics": [],
            }
        });
        setAvatar(null);
    }
    function openDialogContent(titleText) {
        openDialog({
            title: titleText,
            message:
                <span>
                    Are you sure you want to create this new subspace?
                    As the creator, you will automatically become the moderator of this subspace.
                    <br /><br />
                    Proceed?
                </span>,
            cancelBtnText: "Cancel", submitBtnText: "Create", dialogId: 3,
            rest: { navigate, subspaceData, avatar, type, openDialogContent }
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
        subspaceData.topics = topicsArray;
        if (type.toUpperCase() === "CREATE") {
            openDialogContent("Create Subspace");
        } else if (type.toUpperCase() === "UPDATE") {
            handleUpdateSubspace();
        }
    }
    async function handleUpdateSubspace() {
        openModal();
        setLinearProgressBar(true);
        const { status, result } = await dispatch(updateSubspace({ subspaceId, subspaceData }));
        if (status === 200) {
            if (avatar === null || avatar?.file) {
                setModalTitle("Updating Media");
                const { status, result } = await dispatch(uploadSubspaceAvatar({ avatar: avatar?.file, subspaceId, type }));
                if (status === 200) {
                    setReRender(prevReRender => !prevReRender);
                    navigate("/", { state: { status: "success", message: "Subspace updated successfully!", time: new Date().getTime() } });
                } else {
                    setSnackbarValue({ message: result.message, status: "error" });
                    setSnackbarState(true);
                }
            } else {
                setReRender(prevReRender => !prevReRender);
                navigate("/", { state: { status: "success", message: "Subspace updated successfully!", time: new Date().getTime() } });
            }
            closeModal();
            setLinearProgressBar(false);
        } else {
            setSnackbarValue({ message: result.message, status: "error" });
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
                            <Typography variant="h4" sx={{ marginBottom: { xs: "12px", sm: "200px", lg: "24px" } }}>{type} Subspace</Typography>
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
                                        sx={{ height: { xs: "188.5px", sm: "165px", lg: "155px" } }}
                                    />
                                    <hr />
                                </>
                            } {(activeStep === 1) &&
                                <>
                                    <FileUpload
                                        handleFileUpload={handleFileUpload} resetSelectedFiles={resetSelectedFiles}
                                        message="Image compression may take a moment. Please wait."
                                    />
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
                <RealTimeSubspaceViewer classes={classes} subspaceData={subspaceData} avatar={avatar} activeStep={activeStep} />
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
            <Dialog
                open={modal}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ padding: "8px 24px" }}>{modalTitle}</DialogTitle>
                <LinearProgress sx={{ opacity: linearProgressBar ? "1" : "0" }} />
                <DialogContent sx={{ padding: "8px 24px" }}>
                    <DialogContentText id="alert-dialog-description" sx={{ textAlign: "justify" }}>
                        This may take a few moments. Please wait.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default SubspaceForm;