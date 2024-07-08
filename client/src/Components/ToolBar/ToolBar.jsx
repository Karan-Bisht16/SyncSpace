import React from "react";
import { Box, Switch, Avatar, Menu, MenuItem, ListItemIcon, Divider, IconButton, Tooltip } from "@mui/material";
import { PersonAdd, Settings, Logout, DarkMode } from "@mui/icons-material";
import { Link } from "react-router-dom";
import styles from "./styles";

function ToolBar(props) {
    const classes = styles();
    const { mode, user, handleToggleMode, handleLogout } = props;
    // JS for Dropdown Menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }
    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <div>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                >
                    <Avatar sx={classes.avatar} alt={user.name} src={user.avatar}>{user.name.charAt(0)}</Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                sx={{ zIndex: 1501 }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        bgcolor: "background.default",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.default",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleClose} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ListItemIcon>
                            <DarkMode fontSize="small" />
                        </ListItemIcon>
                        Dark Mode
                    </Box>
                    <Switch onChange={handleToggleMode} checked={mode === "dark"}></Switch>
                </MenuItem>
                <MenuItem component={Link} to="/account" onClick={handleClose}>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.primary" }}>
                        <Avatar sx={classes.avatar} alt={user.name} src={user.avatar}>{user.name.charAt(0)}</Avatar> My account
                    </Box>
                </MenuItem>
                <Divider />
                <MenuItem component={Link} to="/add-account" onClick={handleClose}>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.primary" }}>
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Add another account
                    </Box>
                </MenuItem>
                <MenuItem component={Link} to="/settings" onClick={handleClose}>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.primary" }}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </Box>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <Box sx={{ display: "flex", alignItems: "center", color: "text.primary" }}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </Box>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default ToolBar;