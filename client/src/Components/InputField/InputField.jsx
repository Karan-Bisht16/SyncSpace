import React from "react";
import { Box, TextField } from "@mui/material";

function InputField(props) {
    const { name, label, value, type, reference, handleChange, autoFocus, error, helperText, disabled, multiline, rows, id } = props;
    let { sx } = props;
    if (id === "password") {
        if (sx) {
            Object.assign(sx, { position: "relative", right: { xs: "-15px", sm: "-23px" } });
        } else {
            sx = { position: "relative", right: { xs: "-15px", sm: "-23px" } };
        }
    }

    return (
        <Box sx={{ marginTop: "16px" }}>
            <TextField
                variant="outlined"
                name={name}
                label={label}
                value={value}
                type={type}
                onChange={handleChange}
                inputRef={reference}
                autoFocus={autoFocus}
                error={error}
                helperText={helperText}
                disabled={disabled}
                multiline={multiline}
                rows={rows}
                fullWidth
                autoComplete="off"
                sx={sx}
            />
        </Box>
    );
}

export default InputField;