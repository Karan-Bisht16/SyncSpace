import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
// Importing my components
import NotFound from "../../../Components/NotFound/NotFound";
import Posts from "../../../Components/Posts/Posts";

function UserPostsBlock(props) {
    const { user, classes, userPostsCount, secondaryLoading, tabIndex, handleTabChange } = props;

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
                                <Posts searchQuery={{ authorId: user._id }} />
                            }
                        </>
                    }
                </>
                :
                <Posts searchQuery={{ userId: user._id }} customParams="LIKED_POSTS" />
            }
        </>
    );
};

export default UserPostsBlock;