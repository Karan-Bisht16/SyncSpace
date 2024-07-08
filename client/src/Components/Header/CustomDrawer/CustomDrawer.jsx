import React from "react";
import { Box, Typography, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Divider, Collapse } from "@mui/material"
import { TrendingUpRounded, ExpandLess, ExpandMore, ForumTwoTone, GroupAddOutlined, PersonAddAlt1 } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
// Importing styling
import styles from "./styles";
// Importing images
import SyncSpaceLogo from "../../../images/img-syncspace-logo.avif";
import { hatch } from "ldrs"

function CustomDrawer(props) {
    const { user, handleDrawerClose } = props;
    const classes = styles();
    const navigate = useNavigate();
    hatch.register("l-all")

    const mainSubspaces = [{ name: "Universe", _id: "668b9ea1b0513a230dcdea79" }, { name: "Trending", _id: "668b9eceb0513a230dcdea7f" }];
    const [open, setOpen] = React.useState(true);
    function handleClick() {
        setOpen(!open);
    };
    function handleCreateSubspace() {
        handleDrawerClose();
        navigate("/create-subspace");
    }
    function handleSignUp() {
        handleDrawerClose();
        navigate("/authentication");
    }
    function handleSubspace(id, name) {
        handleDrawerClose();
        navigate("/subspace/" + id, { state: { subspaceName: name } });
    }

    return (
        <div>
            <Box sx={classes.mainContainer} >
                <NavLink to="/" style={classes.link}>
                    <Box sx={classes.heading}>
                        <img style={classes.logo} src={SyncSpaceLogo} alt="Logo of SyncSpace"></img>
                        <Typography variant="h5" sx={classes.title}>SyncSpace</Typography>
                    </Box>
                </NavLink>
            </Box>
            <Divider />
            <List>
                {mainSubspaces.map((subspace, index) => (
                    <ListItem key={index} disablePadding name={subspace.name} _id={subspace._id} onClick={() => handleSubspace(subspace._id, subspace.name)}>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ?
                                    <l-all size="20" stroke="3" speed="7.5" color="#0090c1" style={{ marginLeft: "2.5px" }} />
                                    : <TrendingUpRounded sx={classes.icon} />}
                            </ListItemIcon>
                            <ListItemText primary={subspace.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItemButton onClick={handleClick}>
                    <ListItemIcon>
                        <ForumTwoTone sx={classes.icon} />
                    </ListItemIcon>
                    <ListItemText primary="Spaces" />
                    {open ? <ExpandLess sx={classes.icon} /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding onClick={handleCreateSubspace}>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <GroupAddOutlined sx={classes.icon} />
                            </ListItemIcon>
                            <ListItemText primary="Create a SubSpace" />
                        </ListItemButton>
                    </List>
                    {user ?
                        <>
                            {user.subspacesJoined.map((subspace, _id) => (
                                <ListItem key={_id} disablePadding name={subspace.name} _id={subspace._id} onClick={() => handleSubspace(subspace._id, subspace.name)}>
                                    <ListItemButton sx={{ pl: 4 }}>
                                        <ListItemIcon>
                                            <TrendingUpRounded sx={classes.icon} />
                                        </ListItemIcon>
                                        <ListItemText primary={subspace.name} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </>
                        :
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <PersonAddAlt1 sx={classes.icon} />
                            </ListItemIcon>
                            <ListItemText primary="Login/Sign up to view your Subspaces" onClick={handleSignUp} />
                        </ListItemButton>
                    }
                </Collapse>
            </List>
        </div>
    );
}

export default CustomDrawer;