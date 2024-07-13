// Styling for RealTimeProfileViewer.jsx 
const styles = () => ({
    profileContainer: {
        maxHeight: "75vh",
        maxWidth: "100% !important",
        padding: "20px 20px",
        borderRadius: "10px",
        bgcolor: "background.tertiary",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
        marginBottom: { xs: "20px", lg: "0" },
        display: { xs: "none", lg: "block" },
        position: "relative"
    },
    bioContainer: {
        height: "auto",
        maxHeight: "155px",
        width: { xs: "100%", md: "550px", lg: "175px" },
        paddingTop: "8px",
        wordBreak: "break-all",
        overflow: "auto",
        overflowWrap: "break-word",
        hyphens: "auto"
    },
    formDataContainer: { position: "absolute", transform: "translateY(-100%)" },
    gridItemBox: { padding: "8px 0" },
    gridItemTitle: { fontSize: "12px" }
});

export default styles;