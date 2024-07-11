import React, { useState, useEffect, useContext, useRef } from "react";
import { Autocomplete, Box, Button, LinearProgress, Tab, Tabs, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing my components
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import CustomJoditEditor from "../CustomJoditEditor/CustomJoditEditor";
import FileUpload from "../FileUpload/FileUpload";
import { ColorModeContext } from "../../store";
import SnackBar from "../SnackBar/SnackBar";
// Importing actions
import { createPost } from "../../actions/post";
// Importing styling
import styles from "./styles"

function PostForm(props) {
    const { user, previousSubspace } = props;
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const titleTextField = useRef(null);
    const subspaceAutoCompleteTextField = useRef(null);
    const bodyField = useRef(null);
    const { mode } = useContext(ColorModeContext);
    const [postData, setPostData] = useState({
        subspaceId: "",
        subspaceName: "",
        author: user._id,
        authorName: user.userName,
        title: "",
        body: "",
        selectedFile: [],
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
    // AutoComplete - is working?
    const [subspaces, setSubspaces] = useState(null);
    const [predefinedSubspace, setPredefinedSubspace] = useState(false);
    const [loadingSubspace, setLoadingSubspace] = useState(true);
    useEffect(() => {
        console.log("test");
        if (subspaces === null) {
            if (previousSubspace) {
                const subspace = user.subspacesJoined.filter(subspace => subspace.name.replace(/ /g, "-") === previousSubspace)[0];
                setPredefinedSubspace({ ...subspace, subspaceName: subspace.name.replace(/ /g, "-") });
            } else {
                const subspacesArray = user.subspacesJoined.map((subspace) => {
                    return { label: subspace.name, _id: subspace._id }
                });
                setSubspaces(subspacesArray);
            }
            setLoadingSubspace(false);
        }
    }, [previousSubspace, subspaces, user.subspacesJoined]);
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
    // File Upload
    function handleFileUpload(event) {
        let filesArray = [];
        let flag = false;
        event.forEach(file => {
            let fileSize = Number(file.size.slice(0, file.size.length - 2));
            if (fileSize <= process.env.REACT_APP_POST_FILE_SIZE) {
                filesArray.push(file.base64);
            } else {
                flag = true;
            }
        });
        setSnackbarValue({ message: `File size must be less than ${process.env.REACT_APP_POST_FILE_SIZE / 1000}MB!`, status: "error" });
        setSnackbarState(flag);
        setPostData(prevPostData => {
            return { ...prevPostData, "selectedFile": filesArray };
        });
        let string = filesArray.length + (filesArray.length === 1 ? " file selected" : " files selected");
        document.querySelector("#fileChosen").textContent = string;
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
    // Clear Form 
    function handleClear() {
        if (predefinedSubspace) {
            setPostData({
                author: user._id,
                title: "",
                body: "",
                selectedFile: [],
            });
        } else {
            setPostData({
                subspaceId: "",
                subspaceName: "",
                author: user._id,
                title: "",
                body: "",
                selectedFile: [],
            });
        }
        resetSelectedFiles();
    }
    // Submit Form
    function handleSubmit(event) {
        event.preventDefault();
        if (postData.title.trim() === "") {
            titleTextField.current.focus();
            return false;
        }
        if (postData.subspaceName.trim() === "") {
            if (predefinedSubspace) {
                setPostData(prevPostData => {
                    return { ...prevPostData, "subspaceName": predefinedSubspace.subspaceName, "subspaceId": predefinedSubspace.subspaceId };
                });
            } else {
                subspaceAutoCompleteTextField.current.focus();
                return false;
            }
        } else if (!predefinedSubspace) {
            const isValidSubspace = subspaces.find(subspaceObject => {
                return subspaceObject.label === postData.subspaceName
            });
            if (isValidSubspace) {
                postData.subspaceId = isValidSubspace._id;
            } else {
                postData.subspaceName = "";
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
            // postData.subspaceName = postData.subspaceId;
            let updatedData;
            if (tabIndex === "1") {
                const { selectedFile, ...rest } = postData;
                updatedData = rest;
            } else if (tabIndex === "2") {
                const { body, ...rest } = postData;
                updatedData = rest;
            }
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
                <div style={{ width: 300, padding: "16px 0" }}>
                    {loadingSubspace ?
                        <>
                            <TextField disabled id="standard-basic" label="Subspace" variant="standard" />
                            <LinearProgress sx={{ top: "-2.5px", height: "2.5px" }} />
                        </>
                        :
                        <>
                            {!predefinedSubspace ?
                                <Autocomplete
                                    options={subspaces} id="clear-on-escape" clearOnEscape
                                    name="subspace" value={postData.subspaceName}
                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                    onChange={handleAutoCompleteChange}

                                    renderInput={(params) => (
                                        <TextField {...params}
                                            name="subspace" label="Subspace*" variant="standard"
                                            value={postData.subspaceName} inputRef={subspaceAutoCompleteTextField}
                                            onKeyDown={handleAutoCompleteTextFieldChange}
                                        />
                                    )}
                                />
                                :
                                <TextField disabled id="standard-basic" label="Subspace" variant="standard" value={predefinedSubspace.subspaceName || "Error"} />
                            }
                        </>
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
                    <FileUpload isMultiple={true} handleFileUpload={handleFileUpload} resetSelectedFiles={resetSelectedFiles} />
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