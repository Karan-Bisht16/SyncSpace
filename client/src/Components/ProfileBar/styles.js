// Styling for ProfileBar.jsx
const styles = () => ({
    profileContainer: {
        maxHeight: "75vh",
        maxWidth: "100% !important",
        padding: "20px 20px",
        borderRadius: "10px",
        bgcolor: "background.tertiary",
        boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
        marginBottom: { xs: "20px", lg: "0" }
    },
    bioContainer: {
        height: "155px",
        width: { xs: "100%", md: "550px", lg: "175px" },
        paddingTop: "8px",
        wordBreak: "break-all",
        overflow: "auto",
        overflowWrap: "break-word",
        hyphens: "auto"
    },
    mainContainer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" },
    copyLinkBtn: { cursor: "pointer", padding: "4px 12px", borderRadius: "16px", bgcolor: "background.default" },
    gridItemBox: { padding: "8px 0" },
    gridItemTitle: { fontSize: "12px" }
});

export default styles;