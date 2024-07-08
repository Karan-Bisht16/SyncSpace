import React, { useState, useEffect, useContext, useRef } from "react";
import { Autocomplete, TextField, Button, Box, Tabs, Tab, CircularProgress, LinearProgress } from "@mui/material";
import { Upload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// For adding file
import FileBase from "react-file-base64";
// Importing my components
import SnackBar from "../SnackBar/SnackBar";
import CustomJoditEditor from "../CustomJoditEditor/CustomJoditEditor";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import { ColorModeContext } from "../../store";
// Importing actions
import { createPost } from "../../actions/post";
// Importing styling
import styles from "./styles"

function PostForm(props) {
    const { user } = props;
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const titleTextField = useRef(null);
    const subspaceAutoCompleteTextField = useRef(null);
    const bodyField = useRef(null);
    const { mode } = useContext(ColorModeContext);
    const [postData, setPostData] = useState({
        title: "",
        body: "",
        selectedFile: [],
        author: user._id,
        subspace: "",
        subspaceId: "",
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
    const [subspaces, setSubspaces] = useState(null);
    const [loadingSubspace, setLoadingSubspace] = useState(true);
    useEffect(() => {
        if (subspaces === null) {
            const newSubspaces = user.subspacesJoined.map((subspace) => {
                return { label: subspace.name, _id: subspace._id }
            });
            setSubspaces(newSubspaces);
            setLoadingSubspace(false);
        }
    }, []);
    // AutoComplete - is working?
    function handleAutoCompleteTextFieldChange(event) {
        const value = event.target.value;
        console.log(event.target)
        if (event.key === "Enter") {
            setPostData(prevPostData => {
                return { ...prevPostData, "subspace": value };
            });
        }
    }
    function handleAutoCompleteChange(event, value) {
        console.log(event.target)
        if (event.target.getAttribute("data-testid") === "CloseIcon") {
            setPostData(prevPostData => {
                return { ...prevPostData, "subspace": "", "subspaceId": "" }
            });
        } else {
            setPostData(prevPostData => {
                return { ...prevPostData, "subspace": value?.label }
            });
        }
    }
    // Title Field
    function handleTitleChange(event) {
        const { value } = event.target;
        setPostData(prevPostData => {
            return { ...prevPostData, "title": value };
        });
    }
    // Body Field
    function handleBodyChange(content) {
        setPostData(prevPostData => {
            return { ...prevPostData, "body": content };
        });
    }
    // FileBase64
    function handleFileUpload(event) {
        let filesArray = [];
        let flag = false;
        event.forEach(file => {
            let fileSize = Number(file.size.slice(0, file.size.length - 2));
            if (fileSize <= 25000) {
                filesArray.push(file.base64);
            } else {
                flag = true;
            }
        });
        setSnackbarValue({ message: "File size must be less than 25MB!", status: "error" });
        setSnackbarState(flag);
        setPostData(prevPostData => {
            return { ...prevPostData, "selectedFile": filesArray };
        });
        let string = filesArray.length + (filesArray.length === 1 ? " file selected" : " files selected");
        document.querySelector("#fileChosen").textContent = string;
    }
    function selectFilesFunction(event) {
        const file = document.querySelector("input[type=file]");
        file.click();
    }
    function resetSelectedFiles() {
        const file = document.querySelector("input[type=file]");
        file.value = "";
        document.querySelector("#fileChosen").textContent = "No file selected";
        setPostData(prevPostData => {
            return { ...prevPostData, "selectedFile": [] };
        });
    }
    // TabChange
    const [tabIndex, setTabIndex] = useState("1");
    function handleTabChange(event, newTabIndex) {
        setTabIndex(newTabIndex);
        if (newTabIndex === "1") {
            resetSelectedFiles();
        } else if (newTabIndex === "2") {
            setPostData(prevPostData => {
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
        setPostData({
            title: "",
            body: "",
            selectedFile: [],
            author: user._id,
            subspace: "",
            subspaceId: ""
        });
        resetSelectedFiles();
    }
    // Submit Form
    function handleSubmit(event) {
        event.preventDefault();
        if (postData.title.trim() === "") {
            titleTextField.current.focus();
            return false;
        }
        console.log(postData.subspace);
        if (postData.subspace.trim() === "") {
            subspaceAutoCompleteTextField.current.focus();
            return false;
        } else {
            const isValidSubspace = subspaces.find(subspaceObject => {
                return subspaceObject.label === postData.subspace
            });
            console.log(isValidSubspace);
            if (isValidSubspace) {
                postData.subspaceId = isValidSubspace._id;
            } else {
                postData.subspace = "";
                postData.subspaceId = "";
            }
        }
        if (tabIndex === "1" && (postData.body.trim() === "" || postData.body.trim() === "<p><br></p>")) {
            document.querySelector(".jodit-wysiwyg").focus();
            return false;
        }
        if (tabIndex === "2" && postData.selectedFile.length === 0) {
            setSnackbarValue({ message: "Select a file.", status: "error" });
            setSnackbarState(true);
            return false;
        }
        console.log(postData);
        openDialog({ title: "Confirm Post", message: "Are you sure you want to post?", cancelBtnText: "Cancel", submitBtnText: "Post" });
    }
    const [linearProgressBar, setLinearProgressBar] = useState(false);
    async function handleDialog() {
        setLinearProgressBar(true);
        try {
            postData.subspace = postData.subspaceId;
            const { subspaceId, ...updatedData } = postData;
            const { status, result } = await dispatch(createPost(updatedData));
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

    return (
        <div>
            <form noValidate onSubmit={handleSubmit}>
                <div style={{ width: 300, py: 2 }}>
                    {loadingSubspace ?
                        <>
                            <TextField disabled id="standard-basic" label="Subspace" variant="standard" />
                            <LinearProgress sx={{ top: "-2.5px", height: "2.5px" }} />
                        </>
                        :
                        <Autocomplete
                            options={subspaces} id="clear-on-escape" clearOnEscape
                            name="subspace" value={postData.subspace}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            onChange={handleAutoCompleteChange}

                            renderInput={(params) => (
                                <TextField {...params}
                                    name="subspace" label="Subspace*" variant="standard"
                                    value={postData.subspace} inputRef={subspaceAutoCompleteTextField}
                                    onKeyDown={handleAutoCompleteTextFieldChange}
                                />
                            )}
                        />
                    }
                </div>
                <TextField
                    name="title" id="outlined-required" label="Title"
                    sx={{ my: 2 }} autoFocus inputRef={titleTextField}
                    value={postData.title} onChange={handleTitleChange}
                    autoComplete="off" required fullWidth
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
                    <CustomJoditEditor
                        selectedTheme={mode}
                        ref={bodyField}
                        value={postData.body}
                        handleChange={handleBodyChange}
                        key={mode}
                    />
                </Box>
                <Box sx={{ display: tabIndex === "2" ? "block" : "none" }}>
                    <Box sx={{ display: "none" }}>
                        <FileBase type="file" multiple={true} name="selectedFile" onDone={handleFileUpload} />
                    </Box>
                    <Box sx={classes.fileUploadButton} onClick={selectFilesFunction}>
                        <Upload sx={{ fontSize: "50px", padding: "8px 0" }}></Upload>
                        Select a file to upload
                        <span id="fileChosen" style={{ fontSize: "14px", fontWeight: "lighter" }}>
                            No file selected
                        </span>
                    </Box>
                    <Button variant="outlined" size="large" onClick={resetSelectedFiles} sx={classes.resetSelectedFilesBtn}>Reset file</Button>
                </Box>
                <br></br>
                <Box sx={{ float: "right" }}>
                    <Button variant="outlined" size="large" onClick={handleClear} sx={classes.clearBtn}>Clear</Button>
                    <Button variant="contained" color="primary" size="large" type="submit" sx={classes.postBtn}>Post</Button>
                </Box>
            </form>
            <SnackBar openSnackbar={snackbarState} handleClose={handleSnackbarState} timeOut={5000} message={snackbarValue.message} type={snackbarValue.status} />
            <ConfirmationDialog dialog={dialog} closeDialog={closeDialog} handleDialog={handleDialog} linearProgressBar={linearProgressBar} dialogValue={dialogValue} />
        </div>
    );
}

export default PostForm;