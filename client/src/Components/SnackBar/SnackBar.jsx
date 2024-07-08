import React from "react";
import { Snackbar, Alert } from "@mui/material";

function SnackBar(props) {
    return (
        <Snackbar open={props.openSnackbar} autoHideDuration={props.timeOut} onClose={props.handleClose} >
            <Alert
                onClose={props.handleClose}
                severity={props.type}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {props.message}
            </Alert>
        </Snackbar>
    );
}

export default SnackBar;