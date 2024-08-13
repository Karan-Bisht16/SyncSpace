import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { Upload } from "@mui/icons-material";
// For adding file
import FileBase from "react-file-base64";
// Importing styling
import styles from "./styles"

function FileUpload(props) {
    const { isMultiple, handleFileUpload, resetSelectedFiles, title, message } = props;
    const classes = styles();
    function selectFilesFunction(event) {
        const file = document.querySelector("input[type=file]");
        file.click();
    }

    return (
        <>
            <Box sx={{ display: "none" }}>
                <FileBase type="file" multiple={isMultiple} name="selectedFile" onDone={handleFileUpload} />
            </Box>
            <Box sx={classes.fileUploadButton} onClick={selectFilesFunction}>
                <Upload sx={{ fontSize: "50px", padding: "8px 0" }}></Upload>
                {title || "Select a file to upload"}
                <span id="fileChosen" style={{ fontSize: "14px", fontWeight: "lighter" }}>
                    No file selected
                </span>
            </Box>
            {message &&
                <Typography>{message}</Typography>
            }
            <Button variant="outlined" size="large" onClick={resetSelectedFiles} sx={classes.resetSelectedFilesBtn}>Reset file</Button></>
    );
}

export default FileUpload;