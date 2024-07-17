import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
// Importing my components
import NotFound from "../../../Components/NotFound/NotFound";
import Posts from "../../../Components/Posts/Posts";
// Importing styling
import styles from "./styles";

function UserPostsBlock(props) {
    const { user, userPostsCount, secondaryLoading, tabIndex, handleTabChange } = props;
    const { snackbar, confirmationDialog } = props;
    const classes = styles();

    return (
        <>
            <Box sx={{ marginLeft: "16px" }}>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <Tab label="Posts" />
                    <Tab label="Liked Posts" />
                </Tabs>
            </Box>
            {tabIndex === 0 ?
                <>
                    {secondaryLoading ?
                        <Box sx={classes.secondaryLoadingScreenStyling}>
                            <l-loader size="75" speed="1.75" color="#0090c1" />
                        </Box>
                        :
                        <>
                            {userPostsCount === 0 ?
                                <Box sx={classes.noContentContainer}>
                                    <NotFound mainText="You haven't posted anything" />
                                </Box>
                                :
                                <Posts searchQuery={{ authorId: user._id }} snackbar={snackbar} confirmationDialog={confirmationDialog} />
                            }
                        </>
                    }
                </>
                :
                <>
                    <Posts searchQuery={{ userId: user._id }} customParams="LIKED_POSTS" snackbar={snackbar} confirmationDialog={confirmationDialog} />
                </>
            }
        </>
    );
};

export default UserPostsBlock;