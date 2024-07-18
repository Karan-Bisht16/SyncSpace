import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from "@mui/material";

function ConfirmationDialog(props) {
    const { dialog, closeDialog, handleDialog, linearProgressBar, dialogValue } = props;
    const { title, message, cancelBtnText, submitBtnText, type } = dialogValue;

    return (
        <Dialog
            open={dialog}
            onClose={closeDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" sx={{ padding: "8px 24px" }}>{title}</DialogTitle>
            <LinearProgress sx={{ opacity: linearProgressBar ? "1" : "0" }} />
            <DialogContent sx={{ padding: "8px 24px" }}>
                <DialogContentText id="alert-dialog-description" sx={{ textAlign: "justify" }}>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>{cancelBtnText}</Button>
                <Button id="focusPostBtn" variant="contained" color={type} onClick={handleDialog}>{submitBtnText}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;