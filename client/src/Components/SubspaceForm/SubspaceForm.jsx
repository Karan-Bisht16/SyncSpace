import React, { useState, useContext, useRef } from "react";
import { Autocomplete, TextField, Button, Box, Tabs, Tab } from "@mui/material";
import { Description, Upload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing my components
import SnackBar from "../SnackBar/SnackBar";
import InputField from "../InputField/InputField";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
// Importing actions
import { createSubspace } from "../../actions/subspace";
// Importing styling
import styles from "./styles"

function SubspaceForm(props) {
    const { user } = props;
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const nameField = useRef(null);
    const subspaceAutoCompleteTextField = useRef(null);
    const descriptionField = useRef(null);
    // const { mode } = useContext(ColorModeContext);
    const [subspaceData, setSubspaceData] = useState({
        name: "",
        description: "",
        creator: user._id,
        members: [user._id],
        moderators: [user._id],
    });
    // JS for SnackBar
    const [snackbarState, setSnackbarState] = useState(false);
    const [snackbarValue, setSnackbarValue] = useState({ message: "", status: "" });
    function handleSnackbarState(event, reason) {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarState(false);
    }
    // AutoComplete
    function handleAutoCompleteTextFieldChange(event) {
        const value = event.target.value;
        if (event.key === "Enter") {
            setSubspaceData(prevPostData => {
                return { ...prevPostData, "subspace": value };
            });
        }
    }
    function handleAutoCompleteChange(event, value) {
        setSubspaceData(prevPostData => {
            return { ...prevPostData, "subspace": value.label }
        });
    }
    function handleChange(event) {
        const { name, value } = event.target;
        setSubspaceData(prevPostData => {
            return { ...prevPostData, [name]: value };
        });
    }
    // TabChange
    const [tabIndex, setTabIndex] = useState("1");
    function handleTabChange(event, newTabIndex) {
        setTabIndex(newTabIndex);
        if (newTabIndex === "1") {
            // resetSelectedFiles();
        } else if (newTabIndex === "2") {
            setSubspaceData(prevPostData => {
                return { ...prevPostData, body: "" };
            });
        }
    }
    // JS for Dialog
    const [dialog, setDialog] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        title: "",
        message: "",
        cancelBtnText: "",
        submitBtnText: "",
    });
    async function openDialog(values) {
        await setDialogValue(values);
        await setDialog(true);
        document.querySelector("#focusPostBtn").focus();
    };
    function closeDialog() {
        setDialog(false);
    };
    // Clear Form 
    function handleClear() {
        setSubspaceData({
            name: "",
            description: "",
            creator: user._id,
            members: [user._id],
            moderators: [user._id],
        });
    }
    // Submit Form
    function handleSubmit(event) {
        event.preventDefault();
        if (subspaceData.name.trim() === "") {
            nameField.current.focus();
            return false;
        }
        if (subspaceData.description.trim() === "") {
            descriptionField.current.focus();
            return false;
        }
        openDialog({ title: "Confirm Post", message: "Are you sure you want to post?", cancelBtnText: "Cancel", submitBtnText: "Post" });
    }
    const [linearProgressBar, setLinearProgressBar] = useState(false);
    async function handleDialog() {
        setLinearProgressBar(true);
        try {
            const { status, result } = await dispatch(createSubspace(subspaceData));
            closeDialog();
            if (status === 200) {
                navigate(`/`, { state: { status: "success", message: "Post added!" } });
            } else {
                setSnackbarValue({ message: result.message, status: "error" });
                setSnackbarState(true);
                setLinearProgressBar(false);
            }
        } catch (error) {
            setSnackbarValue({ message: error.message, status: "error" });
            setSnackbarState(true);
            setLinearProgressBar(false);
        }
    }
    const subspaces = user.subspacesJoined.map((subspace) => {
        return { label: subspace.name }
    });

    return (
        <div>
            <form noValidate onSubmit={handleSubmit}>
                <InputField
                    name="name" label="Name" value={subspaceData.name} type="text" handleChange={handleChange}
                    autoFocus={true} reference={nameField}
                    sx={{ marginTop: "16px" }} error={true} helperText={" "}
                />
                <TextField
                    name="description" label="Description" value={subspaceData.description} type="text" onChange={handleChange}
                    inputRef={descriptionField} autoComplete="off" fullWidth multiline rows={4}
                    sx={{ marginBottom: "16px" }}
                />
                <Box sx={{ width: "100%" }}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        aria-label="wrapped label tabs example"
                    >
                        <Tab value="1" label="Text" wrapped />
                        <Tab value="2" label="Images & Videos" />
                    </Tabs>
                </Box>
                <Box sx={{ display: tabIndex === "1" ? "block" : "none" }}>
                </Box>
                <Box sx={{ display: tabIndex === "2" ? "block" : "none" }}>
                    <Box sx={{ display: "none" }}>
                        {/* <FileBase type="file" multiple={true} name="selectedFile" onDone={handleFileUpload} /> */}
                    </Box>
                    {/* <Box sx={classes.fileUploadButton} onClick={selectFilesFunction}>
                        <Upload sx={{ fontSize: "50px", padding: "8px 0" }}></Upload>
                        Select a file to upload
                        <span id="fileChosen" style={{ fontSize: "14px", fontWeight: "lighter" }}>
                            No file selected
                        </span>
                    </Box> */}
                    {/* <Button variant="outlined" size="large" onClick={resetSelectedFiles} sx={classes.resetSelectedFilesBtn}>Reset file</Button> */}
                </Box>
                <br></br>
                <Box sx={{ float: "right" }}>
                    <Button variant="outlined" size="large" onClick={handleClear} sx={classes.clearBtn}>Clear</Button>
                    <Button variant="contained" color="primary" size="large" type="submit" sx={classes.createBtn}>Create</Button>
                </Box>
            </form>
            <SnackBar openSnackbar={snackbarState} handleClose={handleSnackbarState} timeOut={5000} message={snackbarValue.message} type={snackbarValue.status} />
            <ConfirmationDialog dialog={dialog} closeDialog={closeDialog} handleDialog={handleDialog} linearProgressBar={linearProgressBar} dialogValue={dialogValue} />
        </div>
    );
}

export default SubspaceForm;