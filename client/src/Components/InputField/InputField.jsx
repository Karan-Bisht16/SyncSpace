import React from "react";
import { Box, TextField } from "@mui/material";

function InputField(props) {
    const { name, label, value, type, reference, handleChange, autoFocus, error, helperText, disabled, multiline, rows, id } = props;
    let { sx } = props;
    if (sx) {
        Object.assign(sx, { marginTop: "16px" });
    } else {
        sx = { marginTop: "16px" };
    }
    if (id === "password") {
        Object.assign(sx, { position: "relative", right: { xs: "-15px", sm: "-23px" } });
    }

    return (
        <TextField
            name={name} label={label} value={value} type={type}
            onChange={handleChange}
            inputRef={reference} autoFocus={autoFocus}
            error={error} helperText={helperText}
            disabled={disabled}
            multiline={multiline} rows={rows}
            fullWidth variant="outlined" autoComplete="off"
            sx={sx}
        />
    );
}

export default InputField;