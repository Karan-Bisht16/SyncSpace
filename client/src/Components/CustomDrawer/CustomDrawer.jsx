import React, { useState, useContext } from "react";
import { Box, Collapse, Divider, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Typography } from "@mui/material"
import { ExpandLess, ExpandMore, ForumTwoTone, GroupAddOutlined, PersonAddAlt1, TrendingUpRounded } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { hatch } from "ldrs";
import SubspaceList from "./SubspaceList/SubspaceList";
import { ReRenderContext } from "../../store";
import styles from "./styles";
import SyncSpaceLogo from "../../assets/img-syncspace-logo.avif";

function CustomDrawer(props) {
    const { user, handleDrawerClose } = props;
    const classes = styles();
    const navigate = useNavigate();

    const mainSubspaces = [{ name: "Universe" }, { name: "Trending" }];
    const [openDropDown, setOpenDropDown] = useState(true);
    function handleDropDownClick() {
        setOpenDropDown(!openDropDown);
    };
    function handleCreateSubspace() {
        handleDrawerClose();
        navigate("/create-subspace");
    }
    function handleSignUp() {
        handleDrawerClose();
        navigate("/authentication");
    }
    function handleSubspaceClick(subspace) {
        handleDrawerClose();
        navigate("/ss/" + subspace.subspaceName);
    }
    const { reRender } = useContext(ReRenderContext);
    hatch.register("l-universe");

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
                    <ListItem key={index} disablePadding onClick={() => handleSubspaceClick(subspace.name)}>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ?
                                    <l-universe size="20" stroke="3" speed="7.5" color="#0090c1" style={{ marginLeft: "2.5px" }} />
                                    : <TrendingUpRounded sx={classes.icon} />}
                            </ListItemIcon>
                            <ListItemText primary={subspace.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItemButton onClick={handleDropDownClick}>
                    <ListItemIcon>
                        <ForumTwoTone sx={classes.icon} />
                    </ListItemIcon>
                    <ListItemText primary="Spaces" />
                    {openDropDown ? <ExpandLess sx={classes.icon} /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openDropDown} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding onClick={handleCreateSubspace}>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon>
                                <GroupAddOutlined sx={classes.icon} />
                            </ListItemIcon>
                            <ListItemText primary="Create a SubSpace" />
                        </ListItemButton>
                    </List>
                    {user ?
                        <SubspaceList user={user} key={reRender} handleSubspaceClick={handleSubspaceClick} />
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