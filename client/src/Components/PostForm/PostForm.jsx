import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, Button, Tab, Tabs, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing my components
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import CustomJoditEditor from "../CustomJoditEditor/CustomJoditEditor";
import FileUpload from "../FileUpload/FileUpload";
// Importing contexts
import { ColorModeContext, ConfirmationDialogContext, SnackBarContext } from "../../store";
// Importing actions
import { createPost, updatePost } from "../../actions/post";
// Importing styling
import styles from "./styles";

function PostForm(props) {
    const { postData, predefinedTabIndex, type, hasPredefinedSubspace, postId, subspacesArray, setPostData } = props;
    const { mode } = useContext(ColorModeContext);
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const { dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar } = useContext(ConfirmationDialogContext)
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const titleTextField = useRef(null);
    const bodyField = useRef(null);

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
    useEffect(() => {
        if (type.toUpperCase() === "EDIT" && predefinedTabIndex === "2") {
            const filesArrayLength = postData.selectedFile.length;
            let string = filesArrayLength + (filesArrayLength === 1 ? " file selected" : " files selected");
            document.querySelector("#fileChosen").textContent = string;
        }
    });
    function handleFileUpload(event) {
        let filesArray = [];
        let flagForSize = false;
        let flagForType = false;
        let cummulativeFileSize = 0;
        event.forEach(file => {
            const isValidFileType = /image|video|audio/.test(file.type)
            if (isValidFileType) {
                let fileSize = Number(file.size.slice(0, file.size.length - 2));
                cummulativeFileSize += fileSize;
                if (fileSize <= process.env.REACT_APP_POST_FILE_SIZE && cummulativeFileSize <= process.env.REACT_APP_POST_FILE_SIZE) {
                    filesArray.push({ file: file.base64, type: file.type });
                } else {
                    flagForSize = true;
                }
            } else {
                flagForType = true;
            }
        });
        if (flagForType) {
            setSnackbarValue({ message: "Invalid file type", status: "error" });
            setSnackbarState(true);
        } else if (flagForSize) {
            if (cummulativeFileSize > process.env.REACT_APP_POST_FILE_SIZE) {
                setSnackbarValue({
                    message: `Cummulative file size must be less than ${process.env.REACT_APP_POST_FILE_SIZE / 1000}MB!`,
                    status: "error"
                });
            } else {
                setSnackbarValue({
                    message: `File size must be less than ${process.env.REACT_APP_POST_FILE_SIZE / 1000}MB!`,
                    status: "error"
                });
            }
            setSnackbarState(true);
        }
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
    // Tab Change
    const [tabIndex, setTabIndex] = useState(predefinedTabIndex);
    function handleTabChange(event, newTabIndex) {
        setTabIndex(newTabIndex);
    }
    // Clear Form 
    function handleClear() {
        setPostData(prevPostData => {
            return { ...prevPostData, "title": "", "body": "" };
        });
        resetSelectedFiles();
    }
    async function handleEdit() {
        let updatedData;
        if (tabIndex === "1") {
            const { selectedFile, ...rest } = postData;
            updatedData = rest;
        } else if (tabIndex === "2") {
            const { body, ...rest } = postData;
            updatedData = rest;
        }
        const { status, result } = await dispatch(updatePost({ postId: postId, updatedData }));
        if (status === 200) {
            navigate("/post/" + postId);
        } else {
            setSnackbarValue({ message: result.message, status: "error" });
            setSnackbarState(true);
        }
    }
    // Submit Form
    function handleSubmit(event) {
        event.preventDefault();
        if (postData.title.trim() === "") {
            titleTextField.current.focus();
            return false;
        }
        if (tabIndex === "1" && (postData.body.trim() === "" || postData.body.trim() === "<p><br></p>")) {
            document.querySelector("div.jodit-wysiwyg").focus();
            return false;
        }
        if (tabIndex === "2" && postData.selectedFile.length === 0) {
            setSnackbarValue({ message: "Select a file.", status: "error" });
            setSnackbarState(true);
            return false;

        }
        if (!hasPredefinedSubspace && (!postData.subspaceId || postData.subspaceId.trim() === "")) {
            if (subspacesArray.length === 0) {
                setSnackbarValue({ message: "Join a subspace first.", status: "error" });
                setSnackbarState(true);
            } else {
                setSnackbarValue({ message: "Select a subspace.", status: "error" });
                setSnackbarState(true);
            }
            return false;
        }
        openDialog({
            title: "Confirm Post",
            message:
                <span>
                    Are you sure you want to post this content?
                    Please review your post to ensure it is free of any sensitive or personal information.
                    Once posted, it can be viewed by all members of the subspace.
                    <br /><br />
                    Proceed?
                </span>,
            cancelBtnText: "Cancel", submitBtnText: "Post"
        });
    }
    async function handleDialog() {
        setLinearProgressBar(true);
        try {
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
                navigate("/", { state: { status: "success", message: "Post added!", time: new Date().getTime() } });
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
            <form noValidate onSubmit={handleSubmit}>
                <>
                    <TextField
                        name="title" id="outlined-required" label="Title" value={postData.title} onChange={handleTitleChange} inputRef={titleTextField}
                        autoComplete="off" required fullWidth autoFocus sx={{ my: 2, display: { xs: "none", sm: "block" } }}
                    />
                    <TextField
                        name="title" id="outlined-required" label="Title" value={postData.title} onChange={handleTitleChange} inputRef={titleTextField}
                        autoComplete="off" required fullWidth sx={{ my: 2, display: { xs: "block", sm: "none" } }}
                    />
                </>
                <Box sx={{ width: "100%" }}>
                    <Tabs
                        value={tabIndex} onChange={handleTabChange}
                        aria-label="wrapped label tabs example"
                    >
                        <Tab value="1" label="Text" wrapped />
                        <Tab value="2" label="Media" />
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
                    <FileUpload
                        isMultiple={true}
                        handleFileUpload={handleFileUpload} resetSelectedFiles={resetSelectedFiles}
                        message="Acceptable file types are image/*, video/* and audio/*"
                    />
                </Box>
                <br />
                {type.toUpperCase() === "EDIT" &&
                    <Box sx={{ float: "left" }}>
                        <Button variant="outlined" size="large" onClick={() => navigate(-1)} sx={classes.clearBtn}>Cancel</Button>
                    </Box>
                }
                <Box sx={{ float: "right" }}>
                    <Button variant="outlined" size="large" onClick={handleClear} sx={classes.clearBtn}>Clear</Button>
                    {type.toUpperCase() === "EDIT" ?
                        <Button variant="contained" color="primary" size="large" onClick={handleEdit} sx={classes.postBtn}>Edit</Button>
                        :
                        <Button variant="contained" color="primary" size="large" type="submit" sx={classes.postBtn}>Post</Button>
                    }
                </Box>
            </form>
            <ConfirmationDialog dialog={dialog} closeDialog={closeDialog} handleDialog={handleDialog} linearProgressBar={linearProgressBar} dialogValue={dialogValue} />
        </div>
    );
}

export default PostForm;