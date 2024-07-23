import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Importing my components
import ConfirmationDialog from "../../Components/ConfirmationDialog/ConfirmationDialog";
import InputField from "../../Components/InputField/InputField";
// Importing actions
import { ConfirmationDialogContext, SnackBarContext } from "../../store/index";
// Importing actions
import { changePassword, deleteProfile } from "../../actions/user";
// Importing styling
import styles from "./styles";

function Settings(props) {
    const { user } = props;
    const { setSnackbarValue, setSnackbarState } = useContext(SnackBarContext);
    const { dialog, dialogValue, openDialog, closeDialog, linearProgressBar, setLinearProgressBar } = useContext(ConfirmationDialogContext);
    const classes = styles();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "SyncSpace: Settings";
    });

    const token = localStorage.getItem("token");
    if (!token) { navigate("/authentication"); }

    const currentPasswordField = useRef(null);
    const newPasswordField = useRef(null);
    const confirmPasswordField = useRef(null);

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => {
            return { ...prevFormData, [name]: value }
        });
    }
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
            setSnackbarValue({ message: "Password do not match.", status: "error" });
            setSnackbarState(true);
            return false;
        } else if (formData.currentPassword.trim() === formData.newPassword.trim()) {
            newPasswordField.current.focus();
            setSnackbarValue({ message: "New password cannot be the same as your old password.", status: "error" });
            setSnackbarState(true);
            return false;
        }
        openDialog({
            title: "Change Password",
            message:
                <span>
                    Are you sure you want to change your password?
                    Please ensure your new password is strong and memorable.
                    <br /><br />
                    Proceed?
                </span>,
            cancelBtnText: "Cancel", submitBtnText: "Change"
        });
    }
    function handleResult(status, result, type) {
        closeDialog();
        if (status === 200) {
            if (type === "DELETE") {
                navigate("/");
                window.location.reload();
            } else if (type === "CHANGE") {
                navigate(-1);
            }
        } else {
            setSnackbarValue({ message: result.message, status: "error" });
            setSnackbarState(true);
        }
    }
    async function handleDialog() {
        setLinearProgressBar(true);
        try {
            if (dialogValue.submitBtnText.toUpperCase() === "CHANGE") {
                const { status, result } = await dispatch(changePassword(formData));
                handleResult(status, result, "CHANGE");
            } else if (dialogValue.submitBtnText.toUpperCase() === "DELETE") {
                const { status, result } = await dispatch(deleteProfile());
                handleResult(status, result, "DELETE");
            }
        } catch (error) {
            closeDialog();
            setSnackbarValue({ message: error.message, status: "error" });
            setSnackbarState(true);
        }
    }
    function handleDelete() {
        openDialog({
            title: "Delete Profile",
            message:
                <span>
                    This action is irreversible. Once deleted, you will not be able to create a new profile with the same name (i.e., e/<b>{user.userName}</b>).
                    If you intend to delete this profile only to recreate it, please consider using the 'Edit Profile' option instead.
                    <br /><br />
                    Are you sure you want to proceed?
                </span>,
            cancelBtnText: "Cancel", submitBtnText: "Delete", type: "error"
        });
    }

    return (
        <Grid container sx={classes.flexContainer}>
            <Grid item xs={0} md={2} sx={classes.leftContainer}></Grid>
            <Box sx={classes.mainContainer}>
                <Typography variant="h4">Settings</Typography>
                {(token && token.length < 500) &&
                    <>
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
                                <Button type="submit" variant="contained" onClick={handleChangePassword} sx={classes.updateBtn}>Change</Button>
                            </Box>
                        </form>
                    </>
                }
                <Typography variant="h5" sx={classes.titleField}>Account Settings</Typography>
                <Divider />
                <Typography paragraph sx={{ margin: "8px 0" }}>
                    Once you delete your account, there is no going back. Please be certain.
                </Typography>
                <Button variant="contained" color="error" onClick={handleDelete}>Delete Account</Button>
            </Box>
            <ConfirmationDialog dialog={dialog} closeDialog={closeDialog} handleDialog={handleDialog} linearProgressBar={linearProgressBar} dialogValue={dialogValue} />
        </Grid>
    );
}

export default Settings;