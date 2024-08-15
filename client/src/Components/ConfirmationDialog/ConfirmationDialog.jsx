import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, LinearProgress } from "@mui/material";

function ConfirmationDialog(props) {
    const { dialog, dialogValue, closeDialog, handleDialog, linearProgressBar } = props;
    const { title, message, cancelBtnText, submitBtnText, type } = dialogValue;

    const [isDisabled, setIsDisabled] = useState(false);

    const dialogFunction = async () => {
        setIsDisabled(true);
        await handleDialog();
        setIsDisabled(false);
    }

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
                <Button disabled={isDisabled} onClick={closeDialog}>{cancelBtnText}</Button>
                <Button id="focusPostBtn" disabled={isDisabled} variant="contained" color={type} onClick={dialogFunction}>
                    {submitBtnText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;