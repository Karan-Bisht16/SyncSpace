import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from "@mui/material";

function ConfirmationDialog(props) {
    const { dialog, closeDialog, handleDialog, linearProgressBar, dialogValue } = props;
    const { title, message, cancelBtnText, submitBtnText } = dialogValue;

    return (
        <Dialog
            open={dialog}
            onClose={closeDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" sx={{ padding: "12px 24px" }}>{title}</DialogTitle>
            <LinearProgress sx={{ opacity: linearProgressBar ? "1" : "0" }} />
            <DialogContent sx={{ padding: "12px 24px" }}>
                <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>{cancelBtnText}</Button>
                <Button id="focusPostBtn" variant="contained" onClick={handleDialog}>{submitBtnText}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;