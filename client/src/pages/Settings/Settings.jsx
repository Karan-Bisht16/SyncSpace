import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing my components
import ConfirmationDialog from "../../Components/ConfirmationDialog/ConfirmationDialog";
import SnackBar from "../../Components/SnackBar/SnackBar";
import InputField from "../../Components/InputField/InputField";
// Importing styling
import styles from "./styles";

function Settings(props) {
    const { user } = props;
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        // Setting webpage title
        document.title = "SyncSpace: Settings";
    });

    const currentPasswordField = useRef(null);
    const newPasswordField = useRef(null);
    const confirmPasswordField = useRef(null);
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
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
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => {
            return { ...prevFormData, [name]: value }
        });
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
    // Clear form
    function handleClear() {
        setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    }
    // Submit Form
    function handleChangePassword(event) {
        event.preventDefault();
        console.log(formData);
        if (formData.currentPassword.trim() === "") {
            currentPasswordField.current.focus();
            return false;
        }
        if (formData.newPassword.trim() === "") {
            newPasswordField.current.focus();
            return false;
        }
        if (formData.confirmPassword.trim() === "") {
            confirmPasswordField.current.focus();
            return false;
        } else if (formData.confirmPassword.trim() !== formData.newPassword.trim()) {
            confirmPasswordField.current.focus();
            setSnackbarValue({ message: "Password doesn't match.", status: "error" });
            setSnackbarState(true);
            return false;
        }
        openDialog({ title: "Change Password?", message: "Be sure to remember your new password.", cancelBtnText: "Cancel", submitBtnText: "Update" });
    }
    const [linearProgressBar, setLinearProgressBar] = useState(false);
    async function handleDialog() {
        setLinearProgressBar(true);
        try {
            if (dialogValue.submitBtnText === "Update") {
                // const { status, result } = await dispatch(updatePassword(formData));
            } else if (dialogValue.submitBtnText === "Delete") {
                // const { status, result } = await dispatch(deleteProfile());
            }
            const { status, result } = formData;
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
    function handleDelete() {
        openDialog({ title: "Delete Profile?", message: "This is action is irreversible. Are you sure?", cancelBtnText: "Cancel", submitBtnText: "Delete" });
    }

    return (
        <Grid container sx={{ display: "flex" }}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <Typography variant="h4">Settings</Typography>
                <Typography variant="h5" sx={classes.titleField}>Change Password</Typography>
                <Divider />
                <form noValidate onSubmit={handleChangePassword}>
                    <InputField
                        name="currentPassword" label="Current Password" value={formData.currentPassword} type="text"
                        handleChange={handleChange} reference={currentPasswordField}
                    />
                    <InputField
                        name="newPassword" label="New Password" value={formData.newPassword} type="text"
                        handleChange={handleChange} reference={newPasswordField}
                    />
                    <InputField
                        name="confirmPassword" label="Confirm Password" value={formData.confirmPassword} type="text"
                        handleChange={handleChange} reference={confirmPasswordField}
                    />
                    <Box sx={{ margin: "16px 0" }}>
                        <Button variant="outlined" onClick={handleClear} sx={classes.clearBtn}>Clear</Button>
                        <Button type="submit" variant="contained" onClick={handleChangePassword} sx={classes.updateBtn}>Update</Button>
                    </Box>
                </form>
                <Typography variant="h5" sx={classes.titleField}>Account Settings</Typography>
                <Divider />
                <Typography paragraph sx={{ margin: "8px 0" }}>Once you delete your account, there is no going back. Please be certain.</Typography>
                <Button variant="contained" color="error" onClick={handleDelete}>Delete Account</Button>
            </Box>
            <SnackBar openSnackbar={snackbarState} handleClose={handleSnackbarState} timeOut={5000} message={snackbarValue.message} type={snackbarValue.status} />
            <ConfirmationDialog dialog={dialog} closeDialog={closeDialog} handleDialog={handleDialog} linearProgressBar={linearProgressBar} dialogValue={dialogValue} />
        </Grid>
    );
}

export default Settings;