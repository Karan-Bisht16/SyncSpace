import React from "react";
import { Avatar, Box, ListItem, ListItemButton, ListItemText, ListItemIcon } from "@mui/material"
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import { useDispatch } from "react-redux";
// Importing actions
import { fetchSubspaces } from "../../../actions/subspace";

function SubspaceList(props) {
    const { user, handleSubspaceClick } = props;
    const dispatch = useDispatch();

    async function fetchLimitedSubspaces(pageParams) {
        const response = await dispatch(fetchSubspaces({ pageParams, searchQuery: { userId: user._id } }));
        return response;
    };
    const data = null;
    const {
        data: queryData = {},
        fetchNextPage, hasNextPage, isFetching,
        isLoading, isError, error,
    } = useInfiniteQuery({
        queryKey: ["subspaces"],
        queryFn: async ({ pageParam = 1 }) => await fetchLimitedSubspaces(pageParam),
        getNextPageParam: (lastPage) => lastPage.next || undefined,
    });

    function loading() {
        return (
            <ListItem disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                        <Box sx={{ bgcolor: "background.primary", padding: "2px", borderRadius: "50%" }}>
                            <Avatar sx={{ height: "35px", width: "35px" }} alt="Subspace avatar"></Avatar>
                        </Box>
                    </ListItemIcon>
                    <ListItemText primary="Loading..." />
                </ListItemButton>
            </ListItem>

        );
    }
    function noMoreData() { return <Box></Box> }

    if (isLoading) { return loading() }
    if (!queryData && !isLoading) { noMoreData() }
    if (isError) { return <div className="text-center w-full">{error.message}</div> }

    return (
        <div className="mx-auto my-10">
            {data &&
                data.results.map((item, index) => (
                    <Box></Box>
                ))}

            <InfiniteScroll
                loadMore={() => {
                    if (!isFetching) fetchNextPage();
                }}
                hasMore={hasNextPage}
            >
                {queryData?.pages?.map((page, index) => (
                    <div key={index}>
                        {page.results.map((subspace, index) => (
                            <ListItem key={index} disablePadding onClick={() => handleSubspaceClick(subspace)}>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemIcon>
                                        <Box sx={{ bgcolor: "background.primary", padding: "2px", borderRadius: "50%" }}>
                                            <Avatar sx={{ height: "35px", width: "35px" }} src={subspace.avatarURL} alt="Subspace avatar">{subspace.name.charAt(0)}</Avatar>
                                        </Box>
                                    </ListItemIcon>
                                    <ListItemText primary={subspace.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
};

export default SubspaceList;