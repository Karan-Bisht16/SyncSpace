import React from "react";
import { Box, Typography } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import { useDispatch } from "react-redux";
import { lineSpinner } from "ldrs";
// Importing my components
import Post from "./Post/Post";
// Importing actions
import { fetchPosts } from "../../actions/post";
// Importing styling
import styles from "./styles";

function Posts(props) {
    const { searchQuery, customParams } = props;
    const classes = styles();
    const dispatch = useDispatch();
    lineSpinner.register("l-loader");

    async function fetchLimitedPosts(pageParams) {
        const response = await dispatch(fetchPosts({ pageParams, searchQuery, customParams }));
        return response;
    };

    const data = null;
    const {
        data: queryData = {},
        fetchNextPage, hasNextPage, isFetching,
        isLoading, isError, error,
    } = useInfiniteQuery({
        queryKey: ["posts", searchQuery],
        queryFn: async ({ pageParam = 1 }) => await fetchLimitedPosts(pageParam),
        getNextPageParam: (lastPage) => lastPage.next || undefined,
    });

    function loading() {
        return (
            <Box sx={classes.mainContainer}>
                <l-loader size="75" speed="1.75" color="#0090c1" />
            </Box>
        );
    }
    function noMoreData() {
        return (
            <Box sx={classes.noContentContainer}>
                <Typography sx={{ fontSize: { xs: "18px", sm: "32px" } }}>Wow! You have reached the end of it all.</Typography>
                <Typography sx={{ fontSize: { xs: "16px", sm: "32px" } }}>Go, touch some grass.</Typography>
            </Box>
        );
    }

    if (isLoading) { return loading() }
    if (!queryData && !isLoading) { noMoreData() }
    if (isError) {
        return (
            <div className="text-center w-full">{error.message}</div>
        );
    }

    return (
        <div className="mx-auto my-10">
            {data &&
                data?.results?.map((item, index) => (
                    <Post key={index} post={item} />
                ))}

            <InfiniteScroll
                loadMore={() => {
                    if (!isFetching) fetchNextPage();
                }}
                hasMore={hasNextPage}
            >
                {queryData.pages.map((page, index) => (
                    <div key={index}>
                        {page?.message &&
                            <Box sx={classes.postMessageContainer}>{page?.message}</Box>
                        }
                        {page?.results?.map((item, index) => (
                            <Post key={index} post={item} />
                        ))}
                    </div>
                ))}
            </InfiniteScroll>
            {isFetching && loading()}
            {!hasNextPage && noMoreData()}
        </div>
    );
}

export default Posts;