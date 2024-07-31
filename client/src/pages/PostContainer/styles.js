// Styling for PostContainer.jsx
const styles = () => ({
    leftContainer: { height: { xs: "0", md: "80vh" }, minWidth: { xs: "0", md: "275px" } },
    mainContainer: { width: { xs: "100%", md: "65%", lg: "75%" }, margin: "0 auto", padding: { xs: "4px", md: "32px 16px" } },
    primaryLoadingScreenStyling: { height: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
    primaryProgressBar: { width: { xs: "80%", md: "500px" }, color: "#0090c1", marginTop: "7.5px" },
    titleFont: { fontSize: { xs: "24px", md: "36px" } },
    noCommentsContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "20vh",
        alignItems: "center",
        borderRadius: "16px",
    },
    addCommentContainer: { width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
    commentCancelBtn: {
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        },
    },
    commentAddBtn: {
        bgcolor: "#0090c1",
        color: "#ffffff",
        marginLeft: "8px",
        "&:hover": {
            backgroundColor: "button.secondary",
            color: "button.primary"
        },
    },
    addCommentBtnContainer: { width: "100%", display: "flex", justifyContent: { xs: "center", md: "start" }, paddingTop: "8px" },
    addCommentBtn: { color: "text.heading", borderRadius: "32px", border: "2px solid", margin: { xs: "0", md: "0 16px" }, width: { xs: "95%", md: "auto" }, padding: "4px 16px" },
    link: { color: "#0090c1", fontSize: "20px", textDecoration: "none", cursor: "pointer" },
    commentsContainer: { minWidth: { xs: "100%", md: "65%", lg: "75%" }, margin: "0 auto", padding: { xs: "0 4px", md: "16px" } },
});

export default styles;